const fs = require('fs')
function getSidebar(dir) {
    const files = fs.readdirSync(`${__dirname}/../${dir}`)
    const sidebar = files.map(file => {
        let fileName = file.split('.')[0]
        if (fileName.toUpperCase() == 'README') {
            return ''
        }
        else {
            return fileName
        }
    })
    return sidebar
}


/*const path = require("path")
const rootpath = path.dirname(__dirname) //执行一次dirname将目录定位到docs目录
const utils = require('./index.js');
const filehelper = require('./initPage.js');
*/
module.exports = {
  title: "Yaozheng Fang's Documents",
  description: "ICS Lab Rights.",
  head: [["link", { rel: "icon", href: `/src/logo.png` }]],
  base: "/",
  dest: "./dist",

  themeConfig: {
    search: true,
    nav: [
      { text: "主页", link: "/" },
      /*{ text: "About", link: "/about/" },*/
      /*{ text: "文章", link: "/article/"},*/
      { text: "文档", link: "/docs/" }
    ],
    sidebar: {
      '/docs/': genSidebarConfig(getSidebar('docs'), false)
      
      /*'/guide/' : utils.genSidebar('测试', filehelper.getFileName(rootpath+"/guide/"), false)*/
    },
    lastUpdated: '最后更新时间'
  },

  markdown: {
    // options for markdown-it-anchor
    anchor: { permalink: false },
    extendMarkdown: md => {
      md.use(require("markdown-it-katex"));
    }
  }
 
};

function genSidebarConfig (children = [''], collapsable) {
  var arr = new Array();
    arr.push({title:'写在前面', children: ['/docs/'], collapsable},{
      title : '文档',
      children,
      collapsable
    })
  return arr;
}
