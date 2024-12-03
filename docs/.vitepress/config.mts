import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TianLang Hacker",
  description: "TianLang Hacker",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: 'Kali Linux', link: '/markdown-examples' },
      { text: 'Android刷机', link: '#'},
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: '开始阅读文档', link: '/markdown-examples' },
          { text: 'Github', link: 'https://github.com/TianLang-Hacker' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TianLang-Hacker' },
      
      { icon:{
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M17.813 4.653h.854q2.266.08 3.773 1.574Q23.946 7.72 24 9.987v7.36q-.054 2.266-1.56 3.773c-1.506 1.507-2.262 1.524-3.773 1.56H5.333q-2.266-.054-3.773-1.56C.053 19.614.036 18.858 0 17.347v-7.36q.054-2.267 1.56-3.76t3.773-1.574h.774l-1.174-1.12a1.23 1.23 0 0 1-.373-.906q0-.534.373-.907l.027-.027q.4-.373.92-.373t.92.373L9.653 4.44q.107.106.187.213h4.267a.8.8 0 0 1 .16-.213l2.853-2.747q.4-.373.92-.373c.347 0 .662.151.929.4s.391.551.391.907q0 .532-.373.906zM5.333 7.24q-1.12.027-1.88.773q-.76.748-.786 1.894v7.52q.026 1.146.786 1.893t1.88.773h13.334q1.12-.026 1.88-.773t.786-1.893v-7.52q-.026-1.147-.786-1.894t-1.88-.773zM8 11.107q.56 0 .933.373q.375.374.4.96v1.173q-.025.586-.4.96q-.373.375-.933.374c-.56-.001-.684-.125-.933-.374q-.375-.373-.4-.96V12.44q0-.56.386-.947q.387-.386.947-.386m8 0q.56 0 .933.373q.375.374.4.96v1.173q-.025.586-.4.96q-.373.375-.933.374c-.56-.001-.684-.125-.933-.374q-.375-.373-.4-.96V12.44q.025-.586.4-.96q.373-.373.933-.373"/></svg>'},
        link:'https://space.bilibili.com/348006102'
      },  //Bilibili

      { icon: 'youtube', link: 'https://www.youtube.com/@tianlanghacker4630'},
      
      { 
        icon:{
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M29.11 26.278c-.72.087-2.804-3.296-2.804-3.296c0 1.959-1.009 4.515-3.191 6.362c1.052.325 3.428 1.198 2.863 2.151c-.457.772-7.844.493-9.977.252c-2.133.24-9.52.519-9.977-.252c-.565-.953 1.807-1.826 2.861-2.151c-2.182-1.846-3.191-4.403-3.191-6.362c0 0-2.083 3.384-2.804 3.296c-.335-.041-.776-1.853.584-6.231c.641-2.064 1.375-3.78 2.509-6.611C5.792 6.13 8.811.001 15.999.001c7.109.001 10.197 6.008 10.017 13.435c1.132 2.826 1.869 4.553 2.509 6.611c1.361 4.379.92 6.191.584 6.231z"/></svg>'},
          link:'https://qm.qq.com/q/GBXesYbw0o'},  //QQ Group

      {
        icon:{
          svg:'<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" fill="currentColor"/></svg>'},
          link:'https://t.me/+LCCpqJLBpWtlYjc1'
        }
    ],  
    footer: {
      
      message: '<a href="https://icp.gov.moe/?keyword=20241034" target="_blank">萌ICP备20241034号</a>',
      copyright: 'Copyright © 2024 天狼Hacker'
    }
  },

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-Hans',
      link: '/index'
    },

    zh_Hant: {
      label: '繁體中文',
      lang: 'zh-Hant',
      link: '/zh-Hant/index'
    },

    en: {
      label: 'English',
      lang: 'en', // 可选，将作为 `lang` 属性添加到 `html` 标签中
      link: '/en/index' // 默认 /fr/ -- 显示在导航栏翻译菜单上，可以是外部的
  },
}
})
