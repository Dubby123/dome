<template>
    <div id="body">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name: 'app'
}
</script>
<style>
html {
    -webkit-text-size-adjust: none !important;
    font-size: 625%; /*100 ÷ 16 × 100% = 625%*/
}
html,
body,
#app,
#app > .el-container {
    height: 100%;
}
/* 重置&默认(reset&base)(tags) */
*[hidefocus],
input,
textarea,
a {
    outline: none;
}
body,
div,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
form,
fieldset,
input,
textarea,
p,
blockquote,
th,
td {
    padding: 0;
    margin: 0;
}
fieldset,
img,
html,
body,
iframe {
    border: 0;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}
li {
    list-style: none;
}
h1,
h2,
h3,
h4,
h5,
h6 {
    font-size: 100%;
}
caption,
th {
    font-weight: normal;
    font-style: normal;
    text-align: left;
}
em,
strong {
    font-weight: bold;
    font-style: normal;
}
body,
textarea,
select,
input,
pre {
    font-family: arial, 'Microsoft yahei', helvetica, sans-serif;
    font-size: 14px;
    color: #555;
}
body {
    background: #eeeeee;
    line-height: 1.5em;
    -webkit-text-size-adjust: none;
}
a,
button {
    cursor: pointer;
}
textarea {
    resize: none;
    overflow: auto;
}
pre {
    white-space: pre-wrap;
}
a {
    color: #333;
    text-decoration: none;
}
input {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    -webkit-user-modify: read-write-plaintext-only;
}
button {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}
#app {
    min-width: 1280px;
    font-family: 'Microsoft yahei', Georgia, Times, 'Times New Roman', serif;
}
#body {
    height: 100%;
}
</style>
