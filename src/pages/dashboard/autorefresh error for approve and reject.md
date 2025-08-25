console error after rejecting and it try to autorefresh but it failed latter i made a manual refresh and it worked  {🔍 Profile Operation: reject {profileId: 1, displayName: 'Unnamed Profile', currentStatus: 'pending', timestamp: '2025-08-25T18:46:58.465Z', operation: 'rejectJobSeeker', …}
jobSeekerService.js:540  PUT http://localhost:3000/profile/1/reject 500 (Internal Server Error)
dispatchXhrRequest @ axios.js?v=766e7024:1672
xhr @ axios.js?v=766e7024:1552
dispatchRequest @ axios.js?v=766e7024:2027
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
rejectJobSeeker @ jobSeekerService.js:540
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73
(anonymous) @ useApprovalManagement.js:292
handleApprovalChange @ JobSeekersPage.jsx:603
onClick @ JobSeekersPage.jsx:1663
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: 'http://localhost:3000/profile/1/reject', method: 'put', …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
rejectJobSeeker @ jobSeekerService.js:540
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73
(anonymous) @ useApprovalManagement.js:292
handleApprovalChange @ JobSeekersPage.jsx:603
onClick @ JobSeekersPage.jsx:1663
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
rejectJobSeeker @ jobSeekerService.js:540
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73
(anonymous) @ useApprovalManagement.js:292
handleApprovalChange @ JobSeekersPage.jsx:603
onClick @ JobSeekersPage.jsx:1663
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
jobSeekerService.js:552 ❌ rejectJobSeeker error: APIError: Server error
    at classifyError (errorHandler.js:196:14)
    at handleError (errorHandler.js:245:56)
    at errorInterceptor (interceptors.js:111:25)
    at async Axios.request (axios.js?v=766e7024:2139:14)
    at async Object.rejectJobSeeker (jobSeekerService.js:540:24)
    at async rejectOperation (useApprovalManagement.js:276:22)
    at async useApprovalManagement.js:73:16
    at async useApprovalManagement.js:292:22
    at async handleApprovalChange (JobSeekersPage.jsx:603:18)
rejectJobSeeker @ jobSeekerService.js:552
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73
(anonymous) @ useApprovalManagement.js:292
handleApprovalChange @ JobSeekersPage.jsx:603
onClick @ JobSeekersPage.jsx:1663
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
jobSeekerService.js:553 ❌ Error response: undefined
rejectJobSeeker @ jobSeekerService.js:553
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73
(anonymous) @ useApprovalManagement.js:292
handleApprovalChange @ JobSeekersPage.jsx:603
onClick @ JobSeekersPage.jsx:1663
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: undefined, method: undefined, …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
rejectJobSeeker @ jobSeekerService.js:561
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73
(anonymous) @ useApprovalManagement.js:292
handleApprovalChange @ JobSeekersPage.jsx:603
onClick @ JobSeekersPage.jsx:1663
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
rejectJobSeeker @ jobSeekerService.js:561
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73
(anonymous) @ useApprovalManagement.js:292
handleApprovalChange @ JobSeekersPage.jsx:603
onClick @ JobSeekersPage.jsx:1663
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
profileUtils.js:133 🔍 Profile Operation: reject {profileId: 1, displayName: 'Unnamed Profile', currentStatus: 'pending', timestamp: '2025-08-25T18:46:59.907Z', operation: 'rejectJobSeeker', …}
jobSeekerService.js:540  PUT http://localhost:3000/profile/1/reject 500 (Internal Server Error)
dispatchXhrRequest @ axios.js?v=766e7024:1672
xhr @ axios.js?v=766e7024:1552
dispatchRequest @ axios.js?v=766e7024:2027
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
rejectJobSeeker @ jobSeekerService.js:540
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73
await in (anonymous)
(anonymous) @ useApprovalManagement.js:292
handleApprovalChange @ JobSeekersPage.jsx:603
onClick @ JobSeekersPage.jsx:1663
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: 'http://localhost:3000/profile/1/reject', method: 'put', …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
rejectJobSeeker @ jobSeekerService.js:540
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73
await in (anonymous)
(anonymous) @ useApprovalManagement.js:292
handleApprovalChange @ JobSeekersPage.jsx:603
onClick @ JobSeekersPage.jsx:1663
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
rejectJobSeeker @ jobSeekerService.js:540
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73
await in (anonymous)
(anonymous) @ useApprovalManagement.js:292
handleApprovalChange @ JobSeekersPage.jsx:603
onClick @ JobSeekersPage.jsx:1663
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
jobSeekerService.js:552 ❌ rejectJobSeeker error: APIError: Server error
    at classifyError (errorHandler.js:196:14)
    at handleError (errorHandler.js:245:56)
    at errorInterceptor (interceptors.js:111:25)
    at async Axios.request (axios.js?v=766e7024:2139:14)
    at async Object.rejectJobSeeker (jobSeekerService.js:540:24)
    at async rejectOperation (useApprovalManagement.js:276:22)
    at async useApprovalManagement.js:73:16
    at async useApprovalManagement.js:292:22
    at async handleApprovalChange (JobSeekersPage.jsx:603:18)
rejectJobSeeker @ jobSeekerService.js:552
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73
await in (anonymous)
(anonymous) @ useApprovalManagement.js:292
handleApprovalChange @ JobSeekersPage.jsx:603
onClick @ JobSeekersPage.jsx:1663
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
jobSeekerService.js:553 ❌ Error response: undefined
rejectJobSeeker @ jobSeekerService.js:553
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73
await in (anonymous)
(anonymous) @ useApprovalManagement.js:292
handleApprovalChange @ JobSeekersPage.jsx:603
onClick @ JobSeekersPage.jsx:1663
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: undefined, method: undefined, …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
rejectJobSeeker @ jobSeekerService.js:561
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73
await in (anonymous)
(anonymous) @ useApprovalManagement.js:292
handleApprovalChange @ JobSeekersPage.jsx:603
onClick @ JobSeekersPage.jsx:1663
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
rejectJobSeeker @ jobSeekerService.js:561
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73
await in (anonymous)
(anonymous) @ useApprovalManagement.js:292
handleApprovalChange @ JobSeekersPage.jsx:603
onClick @ JobSeekersPage.jsx:1663
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
profileUtils.js:133 🔍 Profile Operation: reject {profileId: 1, displayName: 'Unnamed Profile', currentStatus: 'pending', timestamp: '2025-08-25T18:47:02.373Z', operation: 'rejectJobSeeker', …}
jobSeekerService.js:540  PUT http://localhost:3000/profile/1/reject 500 (Internal Server Error)
dispatchXhrRequest @ axios.js?v=766e7024:1672
xhr @ axios.js?v=766e7024:1552
dispatchRequest @ axios.js?v=766e7024:2027
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
rejectJobSeeker @ jobSeekerService.js:540
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: 'http://localhost:3000/profile/1/reject', method: 'put', …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
rejectJobSeeker @ jobSeekerService.js:540
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
rejectJobSeeker @ jobSeekerService.js:540
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73Understand this error
jobSeekerService.js:552 ❌ rejectJobSeeker error: APIError: Server error
    at classifyError (errorHandler.js:196:14)
    at handleError (errorHandler.js:245:56)
    at errorInterceptor (interceptors.js:111:25)
    at async Axios.request (axios.js?v=766e7024:2139:14)
    at async Object.rejectJobSeeker (jobSeekerService.js:540:24)
    at async rejectOperation (useApprovalManagement.js:276:22)
    at async useApprovalManagement.js:73:16
    at async useApprovalManagement.js:292:22
    at async handleApprovalChange (JobSeekersPage.jsx:603:18)
rejectJobSeeker @ jobSeekerService.js:552
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73Understand this error
jobSeekerService.js:553 ❌ Error response: undefined
rejectJobSeeker @ jobSeekerService.js:553
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: undefined, method: undefined, …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
rejectJobSeeker @ jobSeekerService.js:561
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
rejectJobSeeker @ jobSeekerService.js:561
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73Understand this error
profileUtils.js:133 🔍 Profile Operation: reject {profileId: 1, displayName: 'Unnamed Profile', currentStatus: 'pending', timestamp: '2025-08-25T18:47:06.603Z', operation: 'rejectJobSeeker', …}
jobSeekerService.js:540  PUT http://localhost:3000/profile/1/reject 500 (Internal Server Error)
dispatchXhrRequest @ axios.js?v=766e7024:1672
xhr @ axios.js?v=766e7024:1552
dispatchRequest @ axios.js?v=766e7024:2027
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
rejectJobSeeker @ jobSeekerService.js:540
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: 'http://localhost:3000/profile/1/reject', method: 'put', …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
rejectJobSeeker @ jobSeekerService.js:540
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
rejectJobSeeker @ jobSeekerService.js:540
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73Understand this error
jobSeekerService.js:552 ❌ rejectJobSeeker error: APIError: Server error
    at classifyError (errorHandler.js:196:14)
    at handleError (errorHandler.js:245:56)
    at errorInterceptor (interceptors.js:111:25)
    at async Axios.request (axios.js?v=766e7024:2139:14)
    at async Object.rejectJobSeeker (jobSeekerService.js:540:24)
    at async rejectOperation (useApprovalManagement.js:276:22)
    at async useApprovalManagement.js:73:16
    at async useApprovalManagement.js:292:22
    at async handleApprovalChange (JobSeekersPage.jsx:603:18)
rejectJobSeeker @ jobSeekerService.js:552
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73Understand this error
jobSeekerService.js:553 ❌ Error response: undefined
rejectJobSeeker @ jobSeekerService.js:553
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: undefined, method: undefined, …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
rejectJobSeeker @ jobSeekerService.js:561
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
rejectJobSeeker @ jobSeekerService.js:561
await in rejectJobSeeker
rejectOperation @ useApprovalManagement.js:276
(anonymous) @ useApprovalManagement.js:73Understand this error
useApprovalManagement.js:316 ❌ Profile rejection failed, rolling back state: Error: Failed to reject profile: sendProfileRejectedEmail is not a function
    at rejectOperation (useApprovalManagement.js:281:15)
    at async useApprovalManagement.js:73:16
    at async useApprovalManagement.js:292:22
    at async handleApprovalChange (JobSeekersPage.jsx:603:18)
(anonymous) @ useApprovalManagement.js:316Understand this error
useApprovalManagement.js:38 💥 rejectProfile error: Error: Failed to reject profile: sendProfileRejectedEmail is not a function
    at rejectOperation (useApprovalManagement.js:281:15)
    at async useApprovalManagement.js:73:16
    at async useApprovalManagement.js:292:22
    at async handleApprovalChange (JobSeekersPage.jsx:603:18)
(anonymous) @ useApprovalManagement.js:38
(anonymous) @ useApprovalManagement.js:322Understand this error
jobSeekerService.js:596 🔍 Fetching profiles with status 'pending': {page: 1, limit: 10, otherParams: {…}}
jobSeekerService.js:596 🔍 Fetching profiles with status 'approved': {page: 1, limit: 10, otherParams: {…}}
jobSeekerService.js:596 🔍 Fetching profiles with status 'rejected': {page: 1, limit: 10, otherParams: {…}}
jobSeekerService.js:605 ✅ Retrieved 0 profiles with status 'pending' {status: 'pending', count: 0, pagination: {…}}
jobSeekerService.js:605 ✅ Retrieved 0 profiles with status 'approved' {status: 'approved', count: 0, pagination: {…}}
jobSeekerService.js:605 ✅ Retrieved 1 profiles with status 'rejected' {status: 'rejected', count: 1, pagination: {…}}}


console error after approving and it try to autorefresh but it failed {🔍 Profile Operation: approve {profileId: 1, displayName: 'Unnamed Profile', currentStatus: 'pending', timestamp: '2025-08-25T18:49:42.361Z', operation: 'approveJobSeeker'}
jobSeekerService.js:490  PUT http://localhost:3000/profile/1/approve 500 (Internal Server Error)
dispatchXhrRequest @ axios.js?v=766e7024:1672
xhr @ axios.js?v=766e7024:1552
dispatchRequest @ axios.js?v=766e7024:2027
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
approveJobSeeker @ jobSeekerService.js:490
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73
(anonymous) @ useApprovalManagement.js:201
handleApprovalChange @ JobSeekersPage.jsx:596
handleRowAction @ JobSeekersPage.jsx:487
onClick @ JobSeekersPage.jsx:1599
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: 'http://localhost:3000/profile/1/approve', method: 'put', …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
approveJobSeeker @ jobSeekerService.js:490
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73
(anonymous) @ useApprovalManagement.js:201
handleApprovalChange @ JobSeekersPage.jsx:596
handleRowAction @ JobSeekersPage.jsx:487
onClick @ JobSeekersPage.jsx:1599
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
approveJobSeeker @ jobSeekerService.js:490
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73
(anonymous) @ useApprovalManagement.js:201
handleApprovalChange @ JobSeekersPage.jsx:596
handleRowAction @ JobSeekersPage.jsx:487
onClick @ JobSeekersPage.jsx:1599
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
jobSeekerService.js:502 ❌ approveJobSeeker error: APIError: Server error
    at classifyError (errorHandler.js:196:14)
    at handleError (errorHandler.js:245:56)
    at errorInterceptor (interceptors.js:111:25)
    at async Axios.request (axios.js?v=766e7024:2139:14)
    at async Object.approveJobSeeker (jobSeekerService.js:490:24)
    at async approveOperation (useApprovalManagement.js:185:22)
    at async useApprovalManagement.js:73:16
    at async useApprovalManagement.js:201:22
    at async handleApprovalChange (JobSeekersPage.jsx:596:18)
approveJobSeeker @ jobSeekerService.js:502
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73
(anonymous) @ useApprovalManagement.js:201
handleApprovalChange @ JobSeekersPage.jsx:596
handleRowAction @ JobSeekersPage.jsx:487
onClick @ JobSeekersPage.jsx:1599
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
jobSeekerService.js:503 ❌ Error response: undefined
approveJobSeeker @ jobSeekerService.js:503
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73
(anonymous) @ useApprovalManagement.js:201
handleApprovalChange @ JobSeekersPage.jsx:596
handleRowAction @ JobSeekersPage.jsx:487
onClick @ JobSeekersPage.jsx:1599
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: undefined, method: undefined, …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
approveJobSeeker @ jobSeekerService.js:511
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73
(anonymous) @ useApprovalManagement.js:201
handleApprovalChange @ JobSeekersPage.jsx:596
handleRowAction @ JobSeekersPage.jsx:487
onClick @ JobSeekersPage.jsx:1599
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
approveJobSeeker @ jobSeekerService.js:511
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73
(anonymous) @ useApprovalManagement.js:201
handleApprovalChange @ JobSeekersPage.jsx:596
handleRowAction @ JobSeekersPage.jsx:487
onClick @ JobSeekersPage.jsx:1599
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
profileUtils.js:133 🔍 Profile Operation: approve {profileId: 1, displayName: 'Unnamed Profile', currentStatus: 'pending', timestamp: '2025-08-25T18:49:43.616Z', operation: 'approveJobSeeker'}
jobSeekerService.js:490  PUT http://localhost:3000/profile/1/approve 500 (Internal Server Error)
dispatchXhrRequest @ axios.js?v=766e7024:1672
xhr @ axios.js?v=766e7024:1552
dispatchRequest @ axios.js?v=766e7024:2027
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
approveJobSeeker @ jobSeekerService.js:490
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73
await in (anonymous)
(anonymous) @ useApprovalManagement.js:201
handleApprovalChange @ JobSeekersPage.jsx:596
handleRowAction @ JobSeekersPage.jsx:487
onClick @ JobSeekersPage.jsx:1599
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: 'http://localhost:3000/profile/1/approve', method: 'put', …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
approveJobSeeker @ jobSeekerService.js:490
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73
await in (anonymous)
(anonymous) @ useApprovalManagement.js:201
handleApprovalChange @ JobSeekersPage.jsx:596
handleRowAction @ JobSeekersPage.jsx:487
onClick @ JobSeekersPage.jsx:1599
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
approveJobSeeker @ jobSeekerService.js:490
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73
await in (anonymous)
(anonymous) @ useApprovalManagement.js:201
handleApprovalChange @ JobSeekersPage.jsx:596
handleRowAction @ JobSeekersPage.jsx:487
onClick @ JobSeekersPage.jsx:1599
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
jobSeekerService.js:502 ❌ approveJobSeeker error: APIError: Server error
    at classifyError (errorHandler.js:196:14)
    at handleError (errorHandler.js:245:56)
    at errorInterceptor (interceptors.js:111:25)
    at async Axios.request (axios.js?v=766e7024:2139:14)
    at async Object.approveJobSeeker (jobSeekerService.js:490:24)
    at async approveOperation (useApprovalManagement.js:185:22)
    at async useApprovalManagement.js:73:16
    at async useApprovalManagement.js:201:22
    at async handleApprovalChange (JobSeekersPage.jsx:596:18)
approveJobSeeker @ jobSeekerService.js:502
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73
await in (anonymous)
(anonymous) @ useApprovalManagement.js:201
handleApprovalChange @ JobSeekersPage.jsx:596
handleRowAction @ JobSeekersPage.jsx:487
onClick @ JobSeekersPage.jsx:1599
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
jobSeekerService.js:503 ❌ Error response: undefined
approveJobSeeker @ jobSeekerService.js:503
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73
await in (anonymous)
(anonymous) @ useApprovalManagement.js:201
handleApprovalChange @ JobSeekersPage.jsx:596
handleRowAction @ JobSeekersPage.jsx:487
onClick @ JobSeekersPage.jsx:1599
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: undefined, method: undefined, …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
approveJobSeeker @ jobSeekerService.js:511
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73
await in (anonymous)
(anonymous) @ useApprovalManagement.js:201
handleApprovalChange @ JobSeekersPage.jsx:596
handleRowAction @ JobSeekersPage.jsx:487
onClick @ JobSeekersPage.jsx:1599
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
approveJobSeeker @ jobSeekerService.js:511
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73
await in (anonymous)
(anonymous) @ useApprovalManagement.js:201
handleApprovalChange @ JobSeekersPage.jsx:596
handleRowAction @ JobSeekersPage.jsx:487
onClick @ JobSeekersPage.jsx:1599
executeDispatch @ react-dom_client.js?v=766e7024:11736
runWithFiberInDEV @ react-dom_client.js?v=766e7024:1485
processDispatchQueue @ react-dom_client.js?v=766e7024:11772
(anonymous) @ react-dom_client.js?v=766e7024:12182
batchedUpdates$1 @ react-dom_client.js?v=766e7024:2628
dispatchEventForPluginEventSystem @ react-dom_client.js?v=766e7024:11877
dispatchEvent @ react-dom_client.js?v=766e7024:14792
dispatchDiscreteEvent @ react-dom_client.js?v=766e7024:14773Understand this error
profileUtils.js:133 🔍 Profile Operation: approve {profileId: 1, displayName: 'Unnamed Profile', currentStatus: 'pending', timestamp: '2025-08-25T18:49:45.959Z', operation: 'approveJobSeeker'}
jobSeekerService.js:490  PUT http://localhost:3000/profile/1/approve 500 (Internal Server Error)
dispatchXhrRequest @ axios.js?v=766e7024:1672
xhr @ axios.js?v=766e7024:1552
dispatchRequest @ axios.js?v=766e7024:2027
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
approveJobSeeker @ jobSeekerService.js:490
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: 'http://localhost:3000/profile/1/approve', method: 'put', …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
approveJobSeeker @ jobSeekerService.js:490
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
approveJobSeeker @ jobSeekerService.js:490
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73Understand this error
jobSeekerService.js:502 ❌ approveJobSeeker error: APIError: Server error
    at classifyError (errorHandler.js:196:14)
    at handleError (errorHandler.js:245:56)
    at errorInterceptor (interceptors.js:111:25)
    at async Axios.request (axios.js?v=766e7024:2139:14)
    at async Object.approveJobSeeker (jobSeekerService.js:490:24)
    at async approveOperation (useApprovalManagement.js:185:22)
    at async useApprovalManagement.js:73:16
    at async useApprovalManagement.js:201:22
    at async handleApprovalChange (JobSeekersPage.jsx:596:18)
approveJobSeeker @ jobSeekerService.js:502
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73Understand this error
jobSeekerService.js:503 ❌ Error response: undefined
approveJobSeeker @ jobSeekerService.js:503
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: undefined, method: undefined, …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
approveJobSeeker @ jobSeekerService.js:511
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
approveJobSeeker @ jobSeekerService.js:511
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73Understand this error
profileUtils.js:133 🔍 Profile Operation: approve {profileId: 1, displayName: 'Unnamed Profile', currentStatus: 'pending', timestamp: '2025-08-25T18:49:50.708Z', operation: 'approveJobSeeker'}
jobSeekerService.js:490  PUT http://localhost:3000/profile/1/approve 500 (Internal Server Error)
dispatchXhrRequest @ axios.js?v=766e7024:1672
xhr @ axios.js?v=766e7024:1552
dispatchRequest @ axios.js?v=766e7024:2027
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
approveJobSeeker @ jobSeekerService.js:490
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: 'http://localhost:3000/profile/1/approve', method: 'put', …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
approveJobSeeker @ jobSeekerService.js:490
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
errorInterceptor @ interceptors.js:111
Promise.then
_request @ axios.js?v=766e7024:2230
request @ axios.js?v=766e7024:2139
httpMethod @ axios.js?v=766e7024:2277
wrap @ axios.js?v=766e7024:8
approveJobSeeker @ jobSeekerService.js:490
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73Understand this error
jobSeekerService.js:502 ❌ approveJobSeeker error: APIError: Server error
    at classifyError (errorHandler.js:196:14)
    at handleError (errorHandler.js:245:56)
    at errorInterceptor (interceptors.js:111:25)
    at async Axios.request (axios.js?v=766e7024:2139:14)
    at async Object.approveJobSeeker (jobSeekerService.js:490:24)
    at async approveOperation (useApprovalManagement.js:185:22)
    at async useApprovalManagement.js:73:16
    at async useApprovalManagement.js:201:22
    at async handleApprovalChange (JobSeekersPage.jsx:596:18)
approveJobSeeker @ jobSeekerService.js:502
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73Understand this error
jobSeekerService.js:503 ❌ Error response: undefined
approveJobSeeker @ jobSeekerService.js:503
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:229 🚨 API Error: {type: 'SERVER_ERROR', message: 'Server error', status: 500, url: undefined, method: undefined, …}
logError @ errorHandler.js:229
handleError @ errorHandler.js:248
approveJobSeeker @ jobSeekerService.js:511
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73Understand this error
errorHandler.js:231 Original error: AxiosError {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
logError @ errorHandler.js:231
handleError @ errorHandler.js:248
approveJobSeeker @ jobSeekerService.js:511
await in approveJobSeeker
approveOperation @ useApprovalManagement.js:185
(anonymous) @ useApprovalManagement.js:73Understand this error
useApprovalManagement.js:225 ❌ Profile approval failed, rolling back state: Error: Failed to approve profile: sendProfileApprovedEmail is not a function
    at approveOperation (useApprovalManagement.js:190:15)
    at async useApprovalManagement.js:73:16
    at async useApprovalManagement.js:201:22
    at async handleApprovalChange (JobSeekersPage.jsx:596:18)
(anonymous) @ useApprovalManagement.js:225Understand this error
useApprovalManagement.js:38 💥 approveProfile error: Error: Failed to approve profile: sendProfileApprovedEmail is not a function
    at approveOperation (useApprovalManagement.js:190:15)
    at async useApprovalManagement.js:73:16
    at async useApprovalManagement.js:201:22
    at async handleApprovalChange (JobSeekersPage.jsx:596:18)
(anonymous) @ useApprovalManagement.js:38
(anonymous) @ useApprovalManagement.js:231Understand this error}







