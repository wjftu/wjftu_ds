// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// const lightCodeTheme = require('prism-react-renderer/themes/github');
// const darkCodeTheme = require('prism-react-renderer/themes/dracula');
import {themes as prismThemes} from 'prism-react-renderer';

const config = {
  title: '健峰的网站',
  // tagline: 'Dinosaurs are cool',
  url: 'https://wjftu.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  // organizationName: 'facebook', // Usually your GitHub org/user name.
  // projectName: 'docusaurus', // Usually your repo name.

  plugins: [

    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'life',
        path: 'life',
        routeBasePath: 'life',
        sidebarPath: require.resolve('./sidebars.js'),
      }, 
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'note',
        path: 'note',
        routeBasePath: 'note',
        sidebarPath: require.resolve('./sidebars.js'),
      }, 
    ],
    // [
    //   '@docusaurus/plugin-content-docs',
    //   {
    //     id: 'designPattern',
    //     path: 'note/designPattern',
    //     routeBasePath: 'note/designPattern',
    //     sidebarPath: require.resolve('./sidebars.js'),
    //   }, 
    // ],
    // [
    //   '@docusaurus/plugin-content-docs',
    //   {
    //     id: 'docker',
    //     path: 'note/docker',
    //     routeBasePath: 'note/docker',
    //     sidebarPath: require.resolve('./sidebars.js'),
    //   }, 
    // ],
    // [
    //   '@docusaurus/plugin-content-docs',
    //   {
    //     id: 'springboot',
    //     path: 'note/springboot',
    //     routeBasePath: 'note/springboot',
    //     sidebarPath: require.resolve('./sidebars.js'),
    //   }, 
    // ],
    // [
    //   '@docusaurus/plugin-content-docs',
    //   {
    //     id: 'java',
    //     path: 'note/java',
    //     routeBasePath: 'note/java',
    //     sidebarPath: require.resolve('./sidebars.js'),
    //   }, 
    // ],
    // [
    //   '@docusaurus/plugin-content-docs',
    //   {
    //     id: 'tool',
    //     path: 'note/tool',
    //     routeBasePath: 'note/tool',
    //     sidebarPath: require.resolve('./sidebars.js'),
    //   }, 
    // ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // docs: {
        //   sidebarPath: require.resolve('./sidebars.js'),
        //   // Please change this to your repo.
        //   editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        docs: false, 
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          postsPerPage: 4,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleAnalytics: {
          trackingID: 'UA-155045877-1',
          anonymizeIP: false,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Home',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          // {
          //   type: 'doc',
          //   docId: 'intro',
          //   position: 'left',
          //   label: 'Tutorial',
          // },
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/note', label: 'Note', position: 'left'},
          {to: '/life/2023', label: 'Life', position: 'left'},
          // {
          //   href: 'https://github.com/facebook/docusaurus',
          //   label: 'GitHub',
          //   position: 'right',
          // },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Algorithm',
                to: '/note/algorithmPractice',
              },
              {
                label: 'Design Pattern',
                to: '/note/designPattern',
              },
              {
                label: 'Docker',
                to: '/note/docker',
              },
              {
                label: 'Java',
                to: '/note/java',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              // {
              //   label: 'Stack Overflow',
              //   href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              // },
              // {
              //   label: 'Discord',
              //   href: 'https://discordapp.com/invite/docusaurus',
              // },
              // {
              //   label: 'Twitter',
              //   href: 'https://twitter.com/docusaurus',
              // },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              // {
              //   label: 'GitHub',
              //   href: 'https://github.com/facebook/docusaurus',
              // },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Jianfeng's Site. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['java'],
      }
    }),
};

module.exports = config;
