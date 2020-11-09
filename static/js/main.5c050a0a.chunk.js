(this["webpackJsonpcamera-app"]=this["webpackJsonpcamera-app"]||[]).push([[0],{27:function(e,t,a){},28:function(e,t,a){},34:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a(1),l=a.n(o),c=a(20),i=a.n(c),s=(a(27),a(9)),d=a(10),r=a(12),u=a(11),h=(a(28),a(5)),b=function(e){Object(r.a)(a,e);var t=Object(u.a)(a);function a(){return Object(s.a)(this,a),t.apply(this,arguments)}return Object(d.a)(a,[{key:"render",value:function(){return Object(n.jsxs)("div",{id:"home",children:[Object(n.jsx)("h1",{children:"Snappy"}),Object(n.jsx)("p",{children:"The place for easy-peasy webcam pics and filters."}),Object(n.jsx)("p",{children:"(Right in your browser!)"}),Object(n.jsx)(h.b,{to:"/menu",children:" Click to continue"})]})}}]),a}(o.Component),y=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,35)).then((function(t){var a=t.getCLS,n=t.getFID,o=t.getFCP,l=t.getLCP,c=t.getTTFB;a(e),n(e),o(e),l(e),c(e)}))},g=a(2),j=function(e){Object(r.a)(a,e);var t=Object(u.a)(a);function a(){return Object(s.a)(this,a),t.apply(this,arguments)}return Object(d.a)(a,[{key:"render",value:function(){return Object(n.jsxs)("div",{id:"mainMenu",children:[Object(n.jsxs)(h.b,{to:"/camera",children:[" ",Object(n.jsx)("button",{class:"menuButton",children:"Take Photo"})]}),Object(n.jsx)("br",{}),Object(n.jsx)(h.b,{to:"/gallery",children:Object(n.jsx)("button",{class:"menuButton",children:"Photo Gallery"})})]})}}]),a}(o.Component),m=a(3),p=function(e){Object(r.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={width:960,height:540},n.loadStream=n.loadStream.bind(Object(m.a)(n)),n.takePhoto=n.takePhoto.bind(Object(m.a)(n)),n.reload=n.reload.bind(Object(m.a)(n)),n.save=n.save.bind(Object(m.a)(n)),n}return Object(d.a)(a,[{key:"loadStream",value:function(){var e={audio:!1,video:{width:this.state.width,height:this.state.height}};navigator.mediaDevices.getUserMedia(e).then((function(e){var t=document.querySelector("video");t.srcObject=e,t.onloadedmetadata=function(e){t.play()}})).catch((function(e){console.log(e.name+": "+e.message)}))}},{key:"takePhoto",value:function(){var e=this.state.width,t=this.state.height,a=document.querySelector("video"),n=document.querySelector("canvas"),o=n.getContext("2d");n.style.display="block",n.width=e,n.height=t,o.drawImage(a,0,0,e,t),a.style.display="none";var l=document.getElementById("captureButton"),c=document.getElementById("retakeButton"),i=document.getElementById("savePhoto");l.style.display="none",c.style.display="block",i.style.visibility="visible"}},{key:"reload",value:function(){var e=document.querySelector("video");document.querySelector("canvas").style.display="none",e.style.display="block",this.loadStream();var t=document.getElementById("captureButton"),a=document.getElementById("retakeButton"),n=document.getElementById("savePhoto");t.style.display="block",a.style.display="none",n.style.visibility="hidden"}},{key:"save",value:function(){console.log("saving image...");var e=document.querySelector("canvas"),t=document.querySelector("video"),a=e.toDataURL();console.log({image:a}),console.log("saved!"),localStorage.setItem("photo",a),t.srcObject=null,alert("Photo was saved successfully!")}},{key:"componentDidMount",value:function(){this.loadStream()}},{key:"render",value:function(){return Object(n.jsxs)("div",{id:"camera",children:[Object(n.jsx)("h3",{children:"Take your image here!"}),Object(n.jsx)("video",{autoPlay:!0,id:"video"}),Object(n.jsx)("button",{id:"captureButton",onClick:this.takePhoto,children:"Take Photo"}),Object(n.jsx)("button",{id:"retakeButton",onClick:this.reload,style:{display:"none"},children:"Retry"}),Object(n.jsx)("div",{id:"savePhoto",children:Object(n.jsx)(h.b,{to:"editor",onClick:this.save,children:"\u2714\ufe0f Save and Edit "})}),Object(n.jsx)("canvas",{id:"canvas"})]})}}]),a}(o.Component),v=function(e){Object(r.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={width:960,height:540},n.loadPhotos=n.loadPhotos.bind(Object(m.a)(n)),n.clearAll=n.clearAll.bind(Object(m.a)(n)),n}return Object(d.a)(a,[{key:"componentDidMount",value:function(){this.loadPhotos()}},{key:"loadPhotos",value:function(){console.log("loading"),localStorage.length>0&&(console.log("finding previously taken images"),Object.keys(localStorage).forEach((function(e){var t=localStorage.getItem(e);if(t.startsWith("data:image/png;base64")){var a=new Image;a.className="galleryDisplay",a.src=t,a.alt="Output from webcam.",document.getElementById("photos").appendChild(a)}})))}},{key:"clearAll",value:function(){localStorage.clear();var e=document.querySelectorAll(".galleryDisplay");console.log(e),null!==e&&e.forEach((function(e){e.remove()}))}},{key:"render",value:function(){return Object(n.jsxs)("div",{id:"gallery",children:[Object(n.jsx)("h3",{children:"Image gallery"}),Object(n.jsx)("div",{id:"photos"}),Object(n.jsx)("button",{onClick:this.clearAll,children:"Clear Gallery (Delete All)"}),Object(n.jsx)(h.b,{to:"camera",children:"Take Photo"})]})}}]),a}(o.Component),O=function(e){Object(r.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={width:960,height:540,keyNum:1},n.loadPhoto=n.loadPhoto.bind(Object(m.a)(n)),n.displayImg=n.displayImg.bind(Object(m.a)(n)),n.getImageData=n.getImageData.bind(Object(m.a)(n)),n.applyGreyscale=n.applyGreyscale.bind(Object(m.a)(n)),n.applyGreyscale2=n.applyGreyscale2.bind(Object(m.a)(n)),n.applySepia=n.applySepia.bind(Object(m.a)(n)),n.resetImage=n.resetImage.bind(Object(m.a)(n)),n.editedSave=n.editedSave.bind(Object(m.a)(n)),n}return Object(d.a)(a,[{key:"componentDidMount",value:function(){this.loadPhoto()}},{key:"loadPhoto",value:function(){if(console.log("loading"),localStorage.length>0){console.log("finding previously taken images");var e=localStorage.getItem("photo");document.getElementById("display").src=e}}},{key:"displayImg",value:function(){var e=document.getElementById("display"),t=this.state.width,a=this.state.height,n=document.getElementById("editableCanvas"),o=n.getContext("2d");n.width=t,n.height=a,o.drawImage(e,0,0,t,a)}},{key:"getImageData",value:function(){var e=document.getElementById("editableCanvas");return e.getContext("2d").getImageData(0,0,e.width,e.height)}},{key:"applyGreyscale",value:function(){this.displayImg();for(var e=document.getElementById("editableCanvas").getContext("2d"),t=this.getImageData(),a=t.data,n=0;n<a.length;n+=4){var o=parseInt((a[n]+a[n+1]+a[n+2])/3);a[n]=o,a[n+1]=o,a[n+2]=o}e.putImageData(t,0,0),console.log("Applied greyscale")}},{key:"applyGreyscale2",value:function(){this.displayImg();for(var e=document.getElementById("editableCanvas").getContext("2d"),t=this.getImageData(),a=t.data,n=0;n<a.length;n+=4){var o=a[n],l=a[n+1],c=a[n+2],i=parseInt(.2126*o+.7152*l+.0722*c);a[n]=a[n+1]=a[n+2]=i}e.putImageData(t,0,0),console.log("Applied greyscale 2")}},{key:"applySepia",value:function(){this.displayImg();for(var e=document.getElementById("editableCanvas").getContext("2d"),t=this.getImageData(),a=t.data,n=0;n<a.length;n+=4){var o=a[n],l=a[n+1],c=a[n+2],i=.393*o+.769*l+.189*c,s=.349*o+.686*l+.168*c,d=.272*o+.534*l+.131*c;a[n]=i<255?i:255,a[n+1]=s<255?s:255,a[n+2]=d<255?d:255}e.putImageData(t,0,0),console.log("Applied sepia")}},{key:"resetImage",value:function(){this.loadPhoto()}},{key:"editedSave",value:function(){console.log("saving image...");var e=document.getElementById("editableCanvas").toDataURL();console.log({image:e}),console.log("saved!");var t=this.state.keyNum.toString();localStorage.setItem(t,e),this.setState((function(e){return{keyNum:e.keyNum+1}})),alert("Photo saved successfully!")}},{key:"render",value:function(){return Object(n.jsxs)("div",{id:"editor",children:[Object(n.jsx)("h3",{children:"Edit your photo here!"}),Object(n.jsx)("canvas",{id:"editableCanvas"}),Object(n.jsx)("img",{id:"display",alt:"your webcam output is here",onLoad:this.displayImg}),Object(n.jsx)("br",{}),Object(n.jsxs)("div",{id:"options",children:[Object(n.jsx)("button",{id:"reset",onClick:this.resetImage,children:"Reset Image"}),Object(n.jsx)("button",{id:"greyscale",onClick:this.applyGreyscale,children:"Greyscale 1"}),Object(n.jsx)("button",{id:"greyscale2",onClick:this.applyGreyscale2,children:"Greyscale 2"}),Object(n.jsx)("button",{id:"sepia",onClick:this.applySepia,children:"Sepia"}),Object(n.jsx)("button",{id:"editedSave",onClick:this.editedSave,children:"Save"})]}),Object(n.jsx)(h.b,{to:"gallery",children:"Go to Gallery"})]})}}]),a}(o.Component),f=function(){return Object(n.jsx)("h1",{children:"Sorry about that! 404 - Page Not Found"})},k=Object(n.jsx)(l.a.StrictMode,{children:Object(n.jsx)(h.a,{children:Object(n.jsxs)(g.c,{children:[Object(n.jsx)(g.a,{exact:!0,path:"/",component:b}),Object(n.jsx)(g.a,{path:"/menu",component:j}),Object(n.jsx)(g.a,{path:"/camera",component:p}),Object(n.jsx)(g.a,{path:"/gallery",component:v}),Object(n.jsx)(g.a,{path:"/editor",component:O}),Object(n.jsx)(g.a,{component:f})]})})});i.a.render(k,document.getElementById("root")),y()}},[[34,1,2]]]);
//# sourceMappingURL=main.5c050a0a.chunk.js.map