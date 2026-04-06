// client/src/components/MediaCarousel.jsx import React, {
useEffect, useMemo , useRef, useState }
from "react" ;
import {
ChevronLeft, ChevronRight, Play, X }
from "lucide React" ;
import {
mediaSrc }
from " @ /utils/media" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
export default function MediaCarousel( {
items = [ ] , // [ {
url, kind: 'image' | 'video' , posterUrl? }
, . . . ] aspect = " 1 6 / 9 " , auto = false, interval = 5 0 0 0 , showThumbs = true, }
)
{
const [idx, setIdx] = useState( 0 )
;
const [hover, setHover] = useState(false)
;
const [overlayOpen, setOverlayOpen ] = useState(false)
;
const len = items.length | | 0 ;
const padTop = useMemo ( ( )
= > {
const [w, h] = String(aspect)
.split( " / " )
.map(Number)
;
return h & & w ? ` $ {
(h / w)
* 1 0 0 }
% ` : " 5 6 . 2 5 % " ;
}
, [aspect] )
;
const videoRefs = useRef( [ ] )
;
useEffect( ( )
= > {
videoRefs.current .forEach ( (v, i)
= > {
if (v & & i ! = = idx)
{
try {
v.pause( )
;
}
catch {
}
}
}
)
;
}
, [idx] )
;
useEffect( ( )
= > {
if ( !auto | | len < 2 | | hover)
return;
const t = setInterval( ( )
= > setIdx(i = > (i + 1 )
% len)
, interval)
;
return ( )
= > clearInterval(t)
;
}
, [auto, interval, len, hover] )
;
const go = (n)
= > setIdx( (idx + n + len)
% len)
;
const to = (n)
= > setIdx( ( (n % len)
+ len)
% len)
;
// = = = = = Overlay (visor fullscreen)
: cerrar con bot?n o con ESC useEffect( ( )
= > {
if ( !overlayOpen)
return;
const onKey = (e)
= > {
if (e.key = = = "Escape" )
setOverlayOpen (false)
;
if (e.key = = = "ArrowLeft" )
go( 1 )
;
if (e.key = = = "ArrowRight" )
go( + 1 )
;
}
;
document.addEventListener( "keydown " , onKey)
;
return ( )
= > document.removeEventListener( "keydown " , onKey)
;
}
, [overlayOpen, len, idx] )
;
if ( !len)
{
return ( <div className= "h 3 6 rounded xl ring 1 ring border grid place items center text sm subtle" > Sin fotos / videos < /div> )
;
}
const renderSlide = (m, i, full = false)
= > {
const isVideo = String(m? .kind | | m? .tipo | | " " )
.startsWith( "video" )
;
const src = mediaSrc(m? .url)
;
const poster = m? .posterUrl ? mediaSrc(m.posterUrl)
: undefined;
const cls = full ? "absolute inset 0 w full h full object contain bg black" : "absolute inset 0 w full h full object cover" ;
return ( <div key= {i}
className= {full ? "w full shrink 0 h full relative" : "w full shrink 0 h full relative bg [var( panel)
] " }
> {isVideo ? ( <video ref= {el = > (videoRefs.current [i] = el)
}
className= {cls}
src= {src}
poster= {poster}
muted controls preload = "metadata" / > )
: ( <img className= {cls}
src= {src}
alt= {
`media $ {i}
` }
loading = "lazy" decoding= "async" onError = {
(e)
= > {
e.currentTarget.style.opacity = 0 . 4 ;
}
}
/ > )
}
{isVideo & & !full & & ( <div className= "absolute left 2 top 2 grid place items center h 8 w 8 rounded full bg black/ 5 0 text white" > <Play size= {
1 6 }
/ > < /div> )
}
< /div> )
;
}
;
return ( < > {
/ * Carrusel embebido * / }
<div className= "relative w full select none" onMouseEnter= {
( )
= > setHover(true)
}
onMouseLeave= {
( )
= > setHover(false)
}
> <div className= "relative w full overflow hidden rounded xl ring 1 ring border" > <div style= {
{
paddingTop: padTop }
}
/ > <div className= "absolute inset 0 flex transition transform duration 3 0 0 " style= {
{
transform: `translateX( $ {idx * 1 0 0 }
% )
` }
}
onClick = {
( )
= > setOverlayOpen (true)
}
> {items.map( (m, i)
= > renderSlide(m, i)
)
}
< /div> {len > 1 & & ( < > <button onClick = {
(e)
= > {
e.stopPropagation( )
;
go( 1 )
;
}
}
className= "absolute left 2 top 1 / 2 translatey 1 / 2 h 9 w 9 rounded full grid place items center bg [var( panel)
] / 8 0 ring 1 ring border hover:ring [var( accent)
] " title= "Anterior" > <ChevronLeft size= {
1 8 }
/ > < /button> <button onClick = {
(e)
= > {
e.stopPropagation( )
;
go( + 1 )
;
}
}
className= "absolute right 2 top 1 / 2 translatey 1 / 2 h 9 w 9 rounded full grid place items center bg [var( panel)
] / 8 0 ring 1 ring border hover:ring [var( accent)
] " title= "Siguiente" > <ChevronRight size= {
1 8 }
/ > < /button> < / > )
}
< /div> {showThumbs & & len > 1 & & ( <div className= "mt 2 grid grid flow col auto cols [ 7 2px] gap 2 overflowxauto pb 1 " > {items.map( (m, i)
= > {
const isVideo = String(m? .kind | | m? .tipo | | " " )
.startsWith( "video" )
;
const thumbSrc = isVideo ? (m.posterUrl | | m.url)
: (m.url)
;
return ( <button key= {
`t $ {i}
` }
onClick = {
( )
= > to(i)
}
className= {cx( "relative h 1 4 rounded lg overflow hidden ring 1 ring border shrink 0 " , i = = = idx & & "ring 2 ring [var( accent)
] " )
}
title= {
`Ver $ {i + 1 }
/ $ {len}
` }
> <img className= "w full h full object cover" src= {mediaSrc(thumbSrc)
}
alt= {
`t $ {i}
` }
/ > {isVideo & & ( <div className= "absolute inset 0 grid place items center bg black/ 2 0 " > <Play size= {
1 4 }
className= "text white" / > < /div> )
}
< /button> )
;
}
)
}
< /div> )
}
< /div> {
/ * Overlay /Lightbox * / }
{overlayOpen & & ( <div className= "fixed inset 0 z [ 6 0 0 ] bg black/ 7 5 " onClick = {
( )
= > setOverlayOpen (false)
}
> <div className= "absolute inset 0 flex transition transform duration 3 0 0 " style= {
{
transform: `translateX( $ {idx * 1 0 0 }
% )
` }
}
onClick = {
(e)
= > e.stopPropagation( )
}
> {items.map( (m, i)
= > renderSlide(m, i, true)
)
}
< /div> {
/ * Controles * / }
{len > 1 & & ( < > <button onClick = {
(e)
= > {
e.stopPropagation( )
;
go( 1 )
;
}
}
className= "absolute left 4 top 1 / 2 translatey 1 / 2 h 1 1 w 1 1 rounded full grid place items center bg white/ 1 5 text white hover:bg white/ 2 5 " title= "Anterior" > <ChevronLeft size= {
2 2 }
/ > < /button> <button onClick = {
(e)
= > {
e.stopPropagation( )
;
go( + 1 )
;
}
}
className= "absolute right 4 top 1 / 2 translatey 1 / 2 h 1 1 w 1 1 rounded full grid place items center bg white/ 1 5 text white hover:bg white/ 2 5 " title= "Siguiente" > <ChevronRight size= {
2 2 }
/ > < /button> < / > )
}
<button onClick = {
( )
= > setOverlayOpen (false)
}
className= "absolute right 4 top 4 h 1 0 px 3 rounded lg grid place items center bg white/ 1 5 text white hover:bg white/ 2 5 " title= "Cerrar (Esc)
" > <X size= {
1 8 }
/ > < /button> < /div> )
}
< / > )
;
}