## UI plan

1. custeomer can only view
2. admin -> can add category, product

react router dom -> make application more dynamic -> don't need to refersh a page

axious -> provide asyncchornus

try to create nav bar to toggle between admin view and customer view

for each model in backend there should be jsx for each

admin can add product and category customer can only view and buy it

### useState
useState mean you do not need to refresh the page to reflext the latest data automatic refresh the data

```js
const [stateVariable, setStateVariable] = useState(initialValue)
// stateVariable -> Storing Value
// setStateVariable -> Updating Value Work as a setter
```
1. Initialize page with defaut
2. Do some action
3. Update using setter
4. Without refresh, web app is updated

### props

props is Properties
1. props are how data and functions are passed down form a parent component to is child components
example p> runs after every render
### useEffect
do something when open or close
1. run everytime
2. run once
3. run when ... is changed