/* GlobalMoneyCalc cloud account: Supabase Auth + RLS-protected finance records. */
(() => {
"use strict";
const $ = (id) => document.getElementById(id);
const WORDS = window.GMC_ACCOUNT_WORDS || {};
const LANGUAGES = ["en","zh","hi","es","ar","fr","bn","pt","ru","id"];
const LOCALES = window.GMC_LOCALES || {en:"en-US",zh:"zh-CN",hi:"hi-IN",es:"es-ES",ar:"ar",fr:"fr-FR",bn:"bn-BD",pt:"pt-BR",ru:"ru-RU",id:"id-ID"};
const CURRENCIES = ["KWD","USD","BDT","SAR","AED","EUR","GBP","INR","PKR","PHP","CNY","JPY","CAD","AUD","IDR","MYR","SGD","THB","OMR","BHD","QAR","LKR","NPR","CHF","KRW","HKD","TRY","ZAR","EGP","JOD","IQD","RUB","BRL","NGN"];
const CATS = {
  income:[["salary","salary"],["business","business"],["other_income","otherIncome"],["gift","gift"]],
  expense:[["housing","housing"],["food","food"],["transport","transport"],["bills","bills"],["health","health"],["education","education"],["shopping","shopping"],["family","family"],["other_expense","otherExpense"]]
};
let lang = (() => { try { const saved=localStorage.getItem("gmc_language"); return LANGUAGES.includes(saved)?saved:"en"; } catch { return "en"; } })();
let supabase = null, currentUser = null, currentProfile = null;
let transactions = [], debts = [], budgets = [], activeMonth = "";
let loadingUserId = "", isLoading = false;

const t = (key) => (WORDS[lang] && WORDS[lang][key]) || (WORDS.en && WORDS.en[key]) || key;
const today = () => { const d=new Date(); return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-"); };
const monthNow = () => today().slice(0,7);
const monthStart = (month) => month + "-01";
const nextMonth = (month) => { const [y,m]=month.split("-").map(Number); const d=new Date(y,m,1); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-01"; };
const number = (value) => Number(String(value ?? "").trim());
const money = (value,currency) => new Intl.NumberFormat(LOCALES[lang]||"en-US",{maximumFractionDigits:2}).format(Number(value)||0)+" "+currency;
const safeText = (node,value) => { node.textContent = value == null ? "" : String(value); };
const showStatus = (message,kind="ok") => {
  const box=$("statusMessage"); if(!box)return;
  box.textContent=message||""; box.classList.toggle("error",kind==="error"); box.hidden=!message;
};
const clearStatus = () => { if($("statusMessage")) $("statusMessage").hidden=true; };
const make = (tag,cls,text) => { const node=document.createElement(tag); if(cls)node.className=cls; if(text!==undefined)node.textContent=text; return node; };
const option = (select,value,label) => select.add(new Option(label,value));
const selectedLanguage = () => lang;

function applyLanguage(){
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-i18n]").forEach(node=>{
    const key=node.dataset.i18n, value=(WORDS[lang]&&WORDS[lang][key])||(WORDS.en&&WORDS.en[key]);
    if(value!==undefined) node.textContent=value;
  });
  const selector=$("languageSelect");
  if(selector){selector.value=lang;const labels=window.GMC_LANGUAGE_LABELS||{};selector.setAttribute("aria-label",labels[lang]?.name||t("language"));}
  if($("transactionType")){$("transactionType").options[0].text=t("income");$("transactionType").options[1].text=t("expense");}
  if($("debtDirection")){$("debtDirection").options[0].text=t("iOweDirection");$("debtDirection").options[1].text=t("owedDirection");}
  if($("transactionCategory"))buildCategoryOptions();
  document.title=t("title")+" | GlobalMoneyCalc";
  try{localStorage.setItem("gmc_language",lang);}catch{}
  const txType=$("transactionType");
  if(txType){Array.from(txType.options).forEach(o=>{o.textContent=o.value==="income"?t("income"):t("expense");});}
  const debtDirection=$("debtDirection");
  if(debtDirection){Array.from(debtDirection.options).forEach(o=>{o.textContent=o.value==="i_owe"?t("iOweDirection"):t("owedDirection");});}
  buildCategoryOptions();
  if(currentUser){renderDashboard();}
  renderLists();
}
function changeLanguage(next){
  if(!LANGUAGES.includes(next))return;
  lang=next;applyLanguage();updateClock();
}
function updateClock(){
  const time=$("visitorLocalTime"),label=$("visitorLocalLabel"),zoneNode=$("visitorTimeZone");
  if(!time||!label||!zoneNode)return;
  const now=new Date(),zone=Intl.DateTimeFormat().resolvedOptions().timeZone||"Local";
  const locale=LOCALES[lang]||"en-US",labels=window.GMC_LANGUAGE_LABELS||{};
  const word=labels[lang]||labels.en||{time:"Your local date & time",zone:"Time zone: "};
  time.dateTime=now.toISOString();
  time.textContent=new Intl.DateTimeFormat(locale,{dateStyle:"full",timeStyle:"medium"}).format(now);
  label.textContent=word.time;zoneNode.textContent=word.zone+zone;
}
function setAuthMode(mode){
  const signup=mode==="signup";
  $("loginForm").hidden=signup;
  $("signupForm").hidden=!signup;
}
function setBusy(form,busy){
  if(!form)return;
  form.querySelectorAll("button").forEach(b=>{if(!b.dataset.original)b.dataset.original=b.textContent;b.disabled=busy;});
}
function restoreButtons(){
  document.querySelectorAll("button:disabled").forEach(b=>{b.disabled=false;});
}
function openDashboard(session){
  currentUser=session?.user||null;
  $("authSection").hidden=!!currentUser;
  $("dashboardSection").hidden=!currentUser;
  if(currentUser){safeText($("signedInAs"),currentUser.email||"");}
  else{
    $("dashboardSection").hidden=true;
    $("authSection").hidden=false;
    transactions=[];debts=[];budgets=[];currentProfile=null;loadingUserId="";
  }
}
async function ensureProfile(){
  if(!currentUser)return null;
  const {data,error}=await supabase.from("profiles").select("*").eq("id",currentUser.id).maybeSingle();
  if(error)throw error;
  if(data){currentProfile=data;return data;}
  const preferred=(()=>{try{const x=localStorage.getItem("gmc_language");return LANGUAGES.includes(x)?x:"en";}catch{return "en";}})();
  const {data:created,error:insertError}=await supabase.from("profiles").insert({
    id:currentUser.id,
    full_name:currentUser.user_metadata?.full_name||"",
    preferred_currency:"KWD",
    preferred_language:preferred
  }).select("*").single();
  if(insertError)throw insertError;
  currentProfile=created;return created;
}
async function handleSession(session){
  if(!session?.user){openDashboard(null);return;}
  const changed=loadingUserId!==session.user.id;
  currentUser=session.user;
  $("authSection").hidden=true;$("dashboardSection").hidden=false;
  safeText($("signedInAs"),session.user.email||"");
  if(!changed)return;
  loadingUserId=session.user.id;
  try{
    currentProfile=await ensureProfile();
    if(currentProfile?.preferred_language&&LANGUAGES.includes(currentProfile.preferred_language)&&currentProfile.preferred_language!==lang){
      lang=currentProfile.preferred_language;applyLanguage();
    }
    fillProfile();
    await loadDashboard();
  }catch(error){showStatus(error.message||t("networkError"),"error");}
}
function fillSelects(){
  ["profileCurrency","transactionCurrency","debtCurrency","budgetCurrency"].forEach(id=>{
    const select=$(id); if(!select)return;
    const previous=select.value;select.innerHTML="";
    CURRENCIES.forEach(code=>option(select,code,code));
    select.value=CURRENCIES.includes(previous)?previous:"KWD";
  });
  ["profileLanguage","languageSelect"].forEach(id=>{
    const select=$(id);if(!select)return;
    if(id==="profileLanguage"){
      select.innerHTML="";
      const labels={en:"English",zh:"中文",hi:"हिन्दी",es:"Español",ar:"العربية",fr:"Français",bn:"বাংলা",pt:"Português",ru:"Русский",id:"Bahasa Indonesia"};
      LANGUAGES.forEach(code=>option(select,code,labels[code]));
    }
  });
  buildCategoryOptions();
}
function buildCategoryOptions(){
  const type=$("transactionType")?.value||"income";
  const category=$("transactionCategory");if(category){
    const old=category.value;category.innerHTML="";
    (CATS[type]||CATS.income).forEach(([value,key])=>option(category,value,t(key)));
    if((CATS[type]||[]).some(x=>x[0]===old))category.value=old;
  }
  const budgetCategory=$("budgetCategory");if(budgetCategory){
    const old=budgetCategory.value;budgetCategory.innerHTML="";
    option(budgetCategory,"all_expenses",t("allExpenses"));
    CATS.expense.forEach(([value,key])=>option(budgetCategory,value,t(key)));
    if([...budgetCategory.options].some(o=>o.value===old))budgetCategory.value=old;
  }
}
function fillProfile(){
  if(!currentProfile)return;
  $("profileName").value=currentProfile.full_name||currentUser.user_metadata?.full_name||"";
  $("profileCurrency").value=currentProfile.preferred_currency||"KWD";
  $("profileLanguage").value=currentProfile.preferred_language||lang;
  ["transactionCurrency","debtCurrency","budgetCurrency"].forEach(id=>{if($(id))$(id).value=currentProfile.preferred_currency||"KWD";});
}
function initMonthInputs(){
  activeMonth=monthNow();
  $("reportMonth").value=activeMonth;
  $("budgetMonth").value=activeMonth;
  $("transactionDate").value=today();
}
function updateBudgetMonthFromReport(){
  activeMonth=$("reportMonth").value||monthNow();
  $("budgetMonth").value=activeMonth;
}
function amountByCurrency(rows,matcher){
  const sums={};
  rows.filter(matcher).forEach(row=>{const cur=row.currency||"KWD";sums[cur]=(sums[cur]||0)+Number(row.amount||0);});
  return sums;
}
function displayAmounts(sums){
  const items=Object.entries(sums).filter(([,v])=>v!==0);
  return items.length?items.map(([c,v])=>money(v,c)).join(" · "):"—";
}
function addStat(label,amounts){
  const card=make("div","stat");
  card.append(make("small","",label));
  const main=make("strong","",Object.keys(amounts).length?Object.entries(amounts).map(([c,v])=>money(v,c)).join(" · "):"—");
  card.append(main);return card;
}
function renderDashboard(){
  if(!currentUser)return;
  const month=$("reportMonth")?.value||monthNow(),current=transactions.filter(x=>x.transaction_date>=monthStart(month)&&x.transaction_date<nextMonth(month));
  const currencyGroup=(matcher)=>amountByCurrency(current,matcher);
  const stats=$("summaryStats");if(!stats)return;stats.replaceChildren();
  const debtGroup=(direction)=>{const totals={};debts.filter(x=>x.direction===direction).forEach(x=>{const currency=x.currency||"KWD";totals[currency]=(totals[currency]||0)+(Number(x.amount||0)-Number(x.settled_amount||0));});return totals;};
  stats.replaceChildren(
    addStat(t("incomeMonth"),currencyGroup(x=>x.transaction_type==="income")),
    addStat(t("expensesMonth"),currencyGroup(x=>x.transaction_type==="expense")),
    addStat(t("owedToMe"),debtGroup("owed_to_me")),
    addStat(t("iOwe"),debtGroup("i_owe"))
  );
}
function renderLists(){
  renderTransactionList();renderDebtList();renderBudgetList();
}
function renderTransactionList(){
  const box=$("transactionList");if(!box)return;box.replaceChildren();
  if(!currentUser){box.append(make("p","empty",t("loginRequired")));return;}
  const month=$("reportMonth").value||monthNow();
  const rows=transactions.filter(x=>x.transaction_date>=monthStart(month)&&x.transaction_date<nextMonth(month));
  if(!rows.length){box.append(make("p","empty",t("noTransactions")));return;}
  rows.forEach(row=>{
    const wrap=make("div","record"),main=make("div","recordMain");
    const label=row.transaction_type==="income"?t("income"):t("expense");
    const catLabel=t(row.category)||row.category||"";
    main.append(make("strong","",label+" · "+catLabel));
    main.append(make("small","",(row.description||"")+" · "+(row.transaction_date||"")));
    const amount=make("div","recordAmount",money(row.amount,row.currency));
    amount.style.color=row.transaction_type==="income"?"#087e66":"#a43b45";
    const actions=make("div","recordActions");
    const edit=make("button","",t("edit"));edit.type="button";edit.addEventListener("click",()=>editTransaction(row));
    const del=make("button","danger",t("delete"));del.type="button";del.addEventListener("click",()=>deleteTransaction(row.id));
    actions.append(edit,del);main.append(actions);wrap.append(main,amount);box.append(wrap);
  });
}
function renderDebtList(){
  const box=$("debtList");if(!box)return;box.replaceChildren();
  if(!currentUser)return;
  if(!debts.length){box.append(make("p","empty",t("noDebts")));return;}
  debts.forEach(row=>{
    const wrap=make("div","record"),main=make("div","recordMain");
    const direction=row.direction==="owed_to_me"?t("owedDirection"):t("iOweDirection");
    main.append(make("strong","",direction+" · "+row.person_name));
    const remaining=Math.max(0,Number(row.amount)-Number(row.settled_amount||0));
    main.append(make("small","",t("totalAmount")+": "+money(row.amount,row.currency)+" · "+t("outstanding")+": "+money(remaining,row.currency)+(row.due_date?" · "+row.due_date:"")));
    if(row.note)main.append(make("small","",row.note));
    const actions=make("div","recordActions");
    const input=make("input","settleInput");input.type="number";input.min="0";input.max=String(row.amount);input.step="any";input.value=String(row.settled_amount||0);input.setAttribute("aria-label",t("settledAmount"));
    const update=make("button","",t("updateSettlement"));update.type="button";update.addEventListener("click",()=>updateDebtSettlement(row,input.value));
    const del=make("button","danger",t("delete"));del.type="button";del.addEventListener("click",()=>deleteDebt(row.id));
    actions.append(input,update,del);main.append(actions);
    const amount=make("div","recordAmount",money(remaining,row.currency));
    wrap.append(main,amount);box.append(wrap);
  });
}
function renderBudgetList(){
  const box=$("budgetList");if(!box)return;box.replaceChildren();
  if(!currentUser)return;
  if(!budgets.length){box.append(make("p","empty",t("noBudgets")));return;}
  budgets.forEach(row=>{
    const wrap=make("div","record"),main=make("div","recordMain");
    const spent=transactions.filter(x=>x.transaction_type==="expense"&&x.currency===row.currency&&x.transaction_date>=monthStart(activeMonth)&&x.transaction_date<nextMonth(activeMonth)&&(row.category==="all_expenses"||x.category===row.category)).reduce((s,x)=>s+Number(x.amount||0),0);
    const left=Number(row.amount)-spent,ratio=Math.max(0,Math.min(100,spent/Number(row.amount)*100));
    const categoryLabel=row.category==="all_expenses"?t("allExpenses"):t(row.category)||row.category;
    main.append(make("strong","",categoryLabel+" · "+money(row.amount,row.currency)));
    main.append(make("small","",t("spent")+": "+money(spent,row.currency)+" · "+t("remaining")+": "+money(left,row.currency)));
    const progress=make("div","progress"),bar=make("i");bar.style.width=ratio+"%";progress.append(bar);main.append(progress);
    const actions=make("div","recordActions"),del=make("button","danger",t("delete"));del.type="button";del.addEventListener("click",()=>deleteBudget(row.id));actions.append(del);main.append(actions);
    wrap.append(main,make("div","recordAmount",money(left,row.currency)));box.append(wrap);
  });
}
async function loadDashboard(){
  if(!currentUser||isLoading)return;
  isLoading=true;showStatus(t("loading"));
  try{
    const month=$("reportMonth").value||monthNow();
    const [txRes,debtRes,budgetRes]=await Promise.all([
      supabase.from("money_transactions").select("*").gte("transaction_date",monthStart(month)).lt("transaction_date",nextMonth(month)).order("transaction_date",{ascending:false}).order("created_at",{ascending:false}),
      supabase.from("debts").select("*").order("created_at",{ascending:false}),
      supabase.from("monthly_budgets").select("*").eq("budget_month",monthStart(month)).order("category")
    ]);
    const error=txRes.error||debtRes.error||budgetRes.error;if(error)throw error;
    transactions=txRes.data||[];debts=debtRes.data||[];budgets=budgetRes.data||[];activeMonth=month;
    renderDashboard();renderLists();clearStatus();
  }catch(error){showStatus(error.message||t("networkError"),"error");}
  finally{isLoading=false;}
}
async function signUp(event){
  event.preventDefault();clearStatus();const form=$("signupForm");setBusy(form,true);
  try{
    const name=$("signupName").value.trim(),email=$("signupEmail").value.trim(),password=$("signupPassword").value,confirm=$("signupConfirm").value;
    if(password.length<8)throw new Error(t("passTooShort")||"Password must be at least 8 characters.");
    if(password!==confirm)throw new Error(t("passwordMismatch")||"Passwords do not match.");
    const redirectTo=new URL("account.html",window.location.href).toString();
    const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name},emailRedirectTo:redirectTo}});
    if(error)throw error;
    if(data.session){showStatus(t("saved"));await handleSession(data.session);}
    else{showStatus(t("checkEmail"));setAuthMode("login");}
  }catch(error){showStatus(error.message||"Unable to create account.","error");}
  finally{restoreButtons();}
}
async function signIn(event){
  event.preventDefault();clearStatus();const form=$("loginForm");setBusy(form,true);
  try{
    const email=$("loginEmail").value.trim(),password=$("loginPassword").value;
    const {data,error}=await supabase.auth.signInWithPassword({email,password});
    if(error)throw error;await handleSession(data.session);showStatus(t("saved"));
  }catch(error){showStatus(error.message||"Unable to sign in.","error");}
  finally{restoreButtons();}
}
async function sendReset(){
  clearStatus();const email=$("loginEmail").value.trim();
  if(!email){showStatus(t("enterEmail"),"error");$("loginEmail").focus();return;}
  try{
    const redirectTo=new URL("account.html?reset=1",window.location.href).toString();
    const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo});
    if(error)throw error;showStatus(t("resetSent"));
  }catch(error){showStatus(error.message||"Unable to send reset email.","error");}
}
async function updatePassword(event){
  event.preventDefault();const password=$("recoveryPassword").value;
  if(password.length<8){showStatus(t("passTooShort"),"error");return;}
  try{
    const {error}=await supabase.auth.updateUser({password});
    if(error)throw error;
    $("recoverySection").hidden=true;history.replaceState({},document.title,window.location.pathname);
    showStatus(t("saved"));
  }catch(error){showStatus(error.message||"Unable to update password.","error");}
}
async function saveProfile(event){
  event.preventDefault();if(!currentUser)return;
  try{
    const preferred_language=$("profileLanguage").value,preferred_currency=$("profileCurrency").value,full_name=$("profileName").value.trim();
    const {data,error}=await supabase.from("profiles").upsert({id:currentUser.id,full_name,preferred_currency,preferred_language,updated_at:new Date().toISOString()},{onConflict:"id"}).select("*").single();
    if(error)throw error;currentProfile=data;changeLanguage(preferred_language);showStatus(t("profileSaved")||t("saved"));
  }catch(error){showStatus(error.message||"Unable to save profile.","error");}
}
async function saveTransaction(event){
  event.preventDefault();if(!currentUser)return;
  const amount=number($("transactionAmount").value);if(!Number.isFinite(amount)||amount<=0){showStatus(t("errorNumeric"),"error");return;}
  const row={
    user_id:currentUser.id,
    transaction_type:$("transactionType").value,
    amount,
    currency:$("transactionCurrency").value,
    category:$("transactionCategory").value,
    description:$("transactionDescription").value.trim()||null,
    transaction_date:$("transactionDate").value
  };
  try{
    const id=$("transactionId").value;
    const result=id?await supabase.from("money_transactions").update({...row,updated_at:new Date().toISOString()}).eq("id",id).eq("user_id",currentUser.id)
      :await supabase.from("money_transactions").insert(row);
    if(result.error)throw result.error;
    resetTransactionForm();
    await loadDashboard();showStatus(t("saved"));
  }catch(error){showStatus(error.message||"Unable to save transaction.","error");}
}
function editTransaction(row){
  $("transactionId").value=row.id;$("transactionType").value=row.transaction_type;buildCategoryOptions();$("transactionCategory").value=row.category;
  $("transactionAmount").value=row.amount;$("transactionCurrency").value=row.currency;$("transactionDate").value=row.transaction_date;
  $("transactionDescription").value=row.description||"";
  $("cancelTransactionEdit").hidden=false;$("transactionForm").scrollIntoView({behavior:"smooth",block:"center"});
}
function resetTransactionForm(){
  $("transactionForm").reset();$("transactionId").value="";$("transactionDate").value=today();$("transactionCurrency").value=currentProfile?.preferred_currency||"KWD";$("cancelTransactionEdit").hidden=true;buildCategoryOptions();
}
async function deleteTransaction(id){
  if(!confirm(t("confirmDelete")))return;
  try{const {error}=await supabase.from("money_transactions").delete().eq("id",id).eq("user_id",currentUser.id);if(error)throw error;await loadDashboard();showStatus(t("saved"));}
  catch(error){showStatus(error.message||"Delete failed.","error");}
}
async function addDebt(event){
  event.preventDefault();if(!currentUser)return;
  const amount=number($("debtAmount").value),settled=number($("debtSettled").value||0);
  if(!Number.isFinite(amount)||amount<=0||!Number.isFinite(settled)||settled<0||settled>amount){showStatus(t("errorNumeric"),"error");return;}
  const row={user_id:currentUser.id,direction:$("debtDirection").value,person_name:$("debtPerson").value.trim(),amount,settled_amount:settled,currency:$("debtCurrency").value,due_date:$("debtDue").value||null,note:$("debtNote").value.trim()||null,status:settled===0?"open":settled===amount?"settled":"partial"};
  try{const {error}=await supabase.from("debts").insert(row);if(error)throw error;$("debtForm").reset();$("debtCurrency").value=currentProfile?.preferred_currency||"KWD";$("debtSettled").value="0";await loadDashboard();showStatus(t("saved"));}
  catch(error){showStatus(error.message||"Unable to save debt.","error");}
}
async function updateDebtSettlement(row,value){
  const settled=number(value);
  if(!Number.isFinite(settled)||settled<0||settled>Number(row.amount)){showStatus(t("errorNumeric"),"error");return;}
  const status=settled===0?"open":settled===Number(row.amount)?"settled":"partial";
  try{
    const {error}=await supabase.from("debts").update({settled_amount:settled,status,updated_at:new Date().toISOString()}).eq("id",row.id).eq("user_id",currentUser.id);
    if(error)throw error;await loadDashboard();showStatus(t("saved"));
  }catch(error){showStatus(error.message||"Unable to update debt.","error");}
}
async function deleteDebt(id){
  if(!confirm(t("confirmDelete")))return;
  try{const {error}=await supabase.from("debts").delete().eq("id",id).eq("user_id",currentUser.id);if(error)throw error;await loadDashboard();showStatus(t("saved"));}
  catch(error){showStatus(error.message||"Delete failed.","error");}
}
async function saveBudget(event){
  event.preventDefault();if(!currentUser)return;
  const amount=number($("budgetAmount").value),month=$("budgetMonth").value;
  if(!Number.isFinite(amount)||amount<=0||!/^\d{4}-\d{2}$/.test(month)){showStatus(t("errorNumeric"),"error");return;}
  const row={user_id:currentUser.id,budget_month:monthStart(month),category:$("budgetCategory").value,amount,currency:$("budgetCurrency").value,updated_at:new Date().toISOString()};
  try{
    const {error}=await supabase.from("monthly_budgets").upsert(row,{onConflict:"user_id,budget_month,category,currency"});
    if(error)throw error;$("budgetAmount").value="";$("reportMonth").value=month;activeMonth=month;await loadDashboard();showStatus(t("saved"));
  }catch(error){showStatus(error.message||"Unable to save budget.","error");}
}
async function deleteBudget(id){
  if(!confirm(t("confirmDelete")))return;
  try{const {error}=await supabase.from("monthly_budgets").delete().eq("id",id).eq("user_id",currentUser.id);if(error)throw error;await loadDashboard();showStatus(t("saved"));}
  catch(error){showStatus(error.message||"Delete failed.","error");}
}
function bindEvents(){
  $("languageSelect").addEventListener("change",e=>changeLanguage(e.target.value));
  $("showSignup").addEventListener("click",()=>setAuthMode("signup"));
  $("showLogin").addEventListener("click",()=>setAuthMode("login"));
  $("loginForm").addEventListener("submit",signIn);
  $("signupForm").addEventListener("submit",signUp);
  $("forgotButton").addEventListener("click",sendReset);
  $("signOutButton").addEventListener("click",async()=>{const {error}=await supabase.auth.signOut();if(error)showStatus(error.message,"error");else{openDashboard(null);showStatus(t("saved"));}});
  $("refreshButton").addEventListener("click",loadDashboard);
  $("profileForm").addEventListener("submit",saveProfile);
  $("transactionForm").addEventListener("submit",saveTransaction);
  $("cancelTransactionEdit").addEventListener("click",resetTransactionForm);
  $("transactionType").addEventListener("change",buildCategoryOptions);
  $("debtForm").addEventListener("submit",addDebt);
  $("budgetForm").addEventListener("submit",saveBudget);
  $("reportMonth").addEventListener("change",()=>{updateBudgetMonthFromReport();loadDashboard();});
  $("budgetMonth").addEventListener("change",()=>{if($("budgetMonth").value){$("reportMonth").value=$("budgetMonth").value;activeMonth=$("budgetMonth").value;loadDashboard();}});
  $("recoveryForm").addEventListener("submit",updatePassword);
}
async function init(){
  $("year").textContent=new Date().getFullYear();
  fillSelects();initMonthInputs();bindEvents();setAuthMode("login");applyLanguage();updateClock();window.setInterval(updateClock,1000);
  if(!window.supabase?.createClient||!window.GMC_SUPABASE_CONFIG?.url||!window.GMC_SUPABASE_CONFIG?.publishableKey){
    showStatus("Supabase client could not load. Check the network connection and public configuration.","error");return;
  }
  supabase=window.supabase.createClient(window.GMC_SUPABASE_CONFIG.url,window.GMC_SUPABASE_CONFIG.publishableKey,{
    auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}
  });
  const isRecovery=new URLSearchParams(location.search).get("reset")==="1"||location.hash.includes("type=recovery");
  if(isRecovery){$("recoverySection").hidden=false;}
  supabase.auth.onAuthStateChange((event,session)=>{
    if(event==="PASSWORD_RECOVERY")$("recoverySection").hidden=false;
    setTimeout(()=>handleSession(session),0);
  });
  const {data,error}=await supabase.auth.getSession();
  if(error){showStatus(error.message,"error");return;}
  await handleSession(data.session);
}
init();
})();