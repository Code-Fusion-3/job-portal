import{r as c,j as s}from"./vendor-react-P9HPe7xp.js";import{A as d,b as p}from"./index-DLQthGki.js";import{E as r}from"./endpoints-CXiMw_A_.js";import"./vendor-common-QxmXWwBZ.js";import"./vendor-router-DtDQR2uf.js";import"./vendor-motion-Dcrv-VGC.js";import"./vendor-gsap-lnFyu4_T.js";const w=()=>{const[i,l]=c.useState(""),[o,n]=c.useState(!1),h=()=>{l(`
🔧 API Configuration Debug:
Base URL: ${d.BASE_URL}
Environment Variables:
- VITE_DEV_API_URL: http://localhost:3000
- VITE_API_URL: http://localhost:3000
- DEV: false
- MODE: production

Endpoints:
- Employer Login: ${r.EMPLOYER.LOGIN}
- Full URL: ${d.BASE_URL}${r.EMPLOYER.LOGIN}
    `)},m=async()=>{n(!0);try{console.log("🧪 Testing API call...");const e=await p.get("/health");l(t=>t+`

✅ API Call Success:
`+JSON.stringify(e,null,2))}catch(e){console.error("❌ API call failed:",e),l(t=>t+`

❌ API Call Failed:
`+JSON.stringify(e,null,2))}finally{n(!1)}},g=async()=>{n(!0);try{console.log("🧪 Testing employer login...");const e=await p.post(r.EMPLOYER.LOGIN,{email:"test@example.com",password:"test123"});l(t=>t+`

✅ Employer Login Success:
`+JSON.stringify(e,null,2))}catch(e){console.error("❌ Employer login failed:",e),l(t=>t+`

❌ Employer Login Failed:
`+JSON.stringify(e,null,2))}finally{n(!1)}},u=async()=>{n(!0);try{console.log("🧪 Testing fetch call...");const t=await(await fetch("http://localhost:3000/health")).json();l(a=>a+`

✅ Fetch Call Success:
`+JSON.stringify(t,null,2))}catch(e){console.error("❌ Fetch call failed:",e),l(t=>t+`

❌ Fetch Call Failed:
`+JSON.stringify(e,null,2))}finally{n(!1)}},y=async()=>{n(!0);try{console.log("🧪 Testing fetch employer login...");const t=await(await fetch("http://localhost:3000/employer/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:"test@example.com",password:"test123"})})).json();l(a=>a+`

✅ Fetch Employer Login Success:
`+JSON.stringify(t,null,2))}catch(e){console.error("❌ Fetch employer login failed:",e),l(t=>t+`

❌ Fetch Employer Login Failed:
`+JSON.stringify(e,null,2))}finally{n(!1)}};return s.jsx("div",{className:"min-h-screen bg-gray-100 p-8",children:s.jsxs("div",{className:"max-w-4xl mx-auto",children:[s.jsx("h1",{className:"text-3xl font-bold mb-6",children:"API Configuration Test"}),s.jsxs("div",{className:"space-y-4 mb-6",children:[s.jsx("button",{onClick:h,className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",children:"Test API Config"}),s.jsx("button",{onClick:m,disabled:o,className:"px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 ml-2",children:"Test Health Endpoint"}),s.jsx("button",{onClick:g,disabled:o,className:"px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 ml-2",children:"Test Employer Login"}),s.jsx("button",{onClick:u,disabled:o,className:"px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 ml-2",children:"Test Fetch Health"}),s.jsx("button",{onClick:y,disabled:o,className:"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 ml-2",children:"Test Fetch Employer Login"})]}),o&&s.jsxs("div",{className:"text-center py-4",children:[s.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"}),s.jsx("p",{className:"mt-2 text-gray-600",children:"Testing..."})]}),i&&s.jsxs("div",{className:"bg-white rounded-lg shadow p-6",children:[s.jsx("h2",{className:"text-xl font-semibold mb-4",children:"Test Results:"}),s.jsx("pre",{className:"bg-gray-100 p-4 rounded overflow-auto text-sm whitespace-pre-wrap",children:i})]})]})})};export{w as default};
