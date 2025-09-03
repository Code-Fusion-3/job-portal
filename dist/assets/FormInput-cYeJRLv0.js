import{r as y,j as r}from"./vendor-react-HyG-4ult.js";import{m as b}from"./vendor-motion-t1viSSsG.js";const j=y.forwardRef(({type:o="text",id:s,name:l,label:m,value:n,onChange:d,placeholder:p,error:e,icon:a,required:u=!1,className:i="",options:g=[],...c},x)=>r.jsxs("div",{className:i,children:[m&&r.jsxs("label",{htmlFor:s,className:"block text-sm font-medium text-gray-700 mb-2",children:[m,u&&r.jsx("span",{className:"text-red-500 ml-1",children:"*"})]}),r.jsxs("div",{className:"relative",children:[a&&r.jsx(a,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"}),o==="select"?r.jsx("select",{ref:x,id:s,name:l,value:n,onChange:t=>d(t),className:`
              w-full py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent 
              transition-colors duration-200 text-gray-900
              ${a?"pl-10":"pl-4"} 
              pr-4
              ${e?"border-red-300":"border-gray-300"}
            `,...c,children:g.map((t,f)=>r.jsx("option",{value:t.value,children:t.label},f))}):o==="textarea"?r.jsx("textarea",{ref:x,id:s,name:l,value:n,onChange:t=>d(t),className:`
              w-full py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent 
              transition-colors duration-200 text-gray-900 placeholder-gray-500
              ${a?"pl-10":"pl-4"} 
              pr-4
              ${e?"border-red-300":"border-gray-300"}
              ${i}
            `,placeholder:p,rows:4,...c}):r.jsx("input",{ref:x,type:o,id:s,name:l,value:n,onChange:t=>d(t),className:`
              w-full py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent 
              transition-colors duration-200 text-gray-900 placeholder-gray-500
              ${a?"pl-10":"pl-4"} 
              pr-4
              ${e?"border-red-300":"border-gray-300"}
              ${i}
            `,placeholder:p,...c})]}),e&&r.jsx(b.p,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},className:"mt-1 text-sm text-red-600",children:e})]}));j.displayName="FormInput";export{j as F};
