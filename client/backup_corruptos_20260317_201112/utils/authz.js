export function hasRole (user, roleSlug)
{
if ( !user)
return false;
const roles = (user.roles | | [ ] )
.map(r = > (typeof r = = = "string" ? r : r.slug)
)
;
return roles.includes(roleSlug)
;
}
export function hasPerm (user, perm)
{
if ( !user)
return false;
if (hasRole (user, "owner" )
)
return true;
// owner = super const perms = user.permissions | | [ ] ;
return perms.includes(perm)
;
}
/ * * Alcance (si usas memberships proyectadas al user en el login)
* / export function hasScope(user, {
type, id }
)
{
if ( !user)
return false;
if ( !user.memberships)
return false;
return user.memberships.some(m = > {
if (m.scope? .type ! = = type)
return false;
if ( !id)
return true;
return String(m.scope? .id)
= = = String(id)
;
}
)
;
}