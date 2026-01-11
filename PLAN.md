To Be Done
- 
- Payment Feature// done
- sort the item based on somethng
- invalid credential should shown as -> Error username or password false
- use metamask wallet as payment
- customer didn't need customer and admin view
- cart button in sidebar// done
- gmm site (poy advise) as ref
- user should have the cart memory -> may be backend stuff
- user can add to cart firsh the login when checkout!

version 1 -> dont have product detail yet

- need admin page to confige user -> may be user table -> add mew side bar + etc... // still don't have usermanage ment page
- sort data in Manage product table //done
- clear cart in cart context // done
- learn how cart and login work...//done
- integrate stripe // halfway done
- resturctur backend schema and payment // done
- Stripe webhook → confirm payment // done
- Save order to database //done -> need to do order status next
- Clear cart after success // done
- do cancel page -> redirect to customer? // done


 The Flow
```
1. User browses shop (no login needed)
2. User adds items to cart (no login needed)
3. User clicks checkout → LOGIN REQUIRED ✅
4. User completes payment on Stripe (takes 2-5 minutes)
5. User returns to success page → NO LOGIN NEEDED ❌
   ↳ Why? session_id is enough to verify payment
6. User clicks "Return to Shop" → LOGIN REQUIRED ✅
   ↳ Why? To see their account, orders, continue shopping

Order status
pending   → created but unpaid
paid      → webhook confirmed
cancelled → user explicitly cancelled
expired   → unpaid after time limit

Need to send poy at sunday with slide and video
TODAY




On Admin Page
- Remove Category // done
- Remove Product    // done
- Create product -> add image //done
- Edit Product -> add image //done

On Customer Page
- Items name should not be duplicate //done -> just remove the dupl in admin page
- Item should have pic // done
- sort the item based on somethng
- how buyer can buy

On login page
- if user go to customer or admin route and nosession it should route to login page first //done
- customer should see the product first and when buy need to login
- invalid credential should shown as -> Error username or password false

***minor
Image Handler
- image size

Change choose file button <- look weird>




if session expire it need to redirect to logins

After Editing it change position... <- need the way to order based on something...(price, name, etc)