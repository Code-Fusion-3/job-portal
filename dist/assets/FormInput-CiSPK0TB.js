import{r as y,j as r,m as b}from"./vendor-react-Ciyz3SKt.js";const j=y.forwardRef(({type:o="text",id:s,name:l,label:u,value:n,onChange:d,placeholder:p,error:t,icon:a,required:m=!1,className:i="",options:g=[],...c},x)=>r.jsxs("div",{className:i,children:[u&&r.jsxs("label",{htmlFor:s,className:"block text-sm font-medium text-gray-700 mb-2",children:[u,m&&r.jsx("span",{className:"text-red-500 ml-1",children:"*"})]}),r.jsxs("div",{className:"relative",children:[a&&r.jsx(a,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"}),o==="select"?r.jsx("select",{ref:x,id:s,name:l,value:n,onChange:e=>d(e),className:`
              w-full py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent 
              transition-colors duration-200 text-gray-900
              ${a?"pl-10":"pl-4"} 
              pr-4
              ${t?"border-red-300":"border-gray-300"}
            `,...c,children:g.map((e,f)=>r.jsx("option",{value:e.value,children:e.label},f))}):o==="textarea"?r.jsx("textarea",{ref:x,id:s,name:l,value:n,onChange:e=>d(e),className:`
              w-full py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent 
              transition-colors duration-200 text-gray-900 placeholder-gray-500
              ${a?"pl-10":"pl-4"} 
              pr-4
              ${t?"border-red-300":"border-gray-300"}
              ${i}
            `,placeholder:p,rows:4,...c}):r.jsx("input",{ref:x,type:o,id:s,name:l,value:n,onChange:e=>d(e),className:`
              w-full py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent 
              transition-colors duration-200 text-gray-900 placeholder-gray-500
              ${a?"pl-10":"pl-4"} 
              pr-4
              ${t?"border-red-300":"border-gray-300"}
              ${i}
            `,placeholder:p,...c})]}),t&&r.jsx(b.p,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},className:"mt-1 text-sm text-red-600",children:t})]}));j.displayName="FormInput";export{j as F};
