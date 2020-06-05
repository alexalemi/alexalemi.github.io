<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>blog.alexalemi.com</title>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-153903138-1"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-153903138-1');
    </script>

    <!-- RSS Feed -->
    <link rel="alternate" type="application/rss+xml" title="blog.AlexAlemi.com" href="https://blog.alexalemi.com/rss.xml" />

    <!-- Search Engine -->
    <meta name="description" content="Alexander A. Alemi, Research Scientist, Blog">
    <meta name="image" content="https://alexalemi.com/images/me_small.jpg">

    <!-- Schema.org for Google -->
    <meta itemprop="name" content="blog.alexalemi.com">
    <meta itemprop="description" content="Alexander A. Alemi, Research Scientist, Blog">
    <meta itemprop="image" content="https://alexalemi.com/images/me_small.jpg">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="blog.alexalemi.com">
    <meta name="twitter:description" content="Alexander A. Alemi, Research Scientist, Blog">
    <meta name="twitter:creator" content="alemi">
    <meta name="twitter:image:src" content="https://alexalemi.com/images/me_small.jpg">

    <!-- Open Graph general (Facebook, Pinterest & Google+) -->
    <meta name="og:title" content="blog.alexalemi.com">
    <meta name="og:description" content="Alexander A. Alemi, Research Scientist, Blog">
    <meta name="og:image" content="https://alexalemi.com/images/me_small.jpg">
    <meta name="og:url" content="https://blog.alexalemi.com">
    <meta name="og:site_name" content="blog.alexalemi.com">
    <meta name="og:type" content="website">

    <!-- Fonts -->
    <script type="text/javascript">
        WebFontConfig = {
            google: { families: [ 'Muli', 'Lato' ] }
        };
        (function() {
            var wf = document.createElement('script');
            wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
        })();
    </script>

    <!-- Inline CSS -->
    <style>
        /* Browser reset */
        html {
            box-sizing: border-box;
            line-height: 1.15;
            -webkit-text-size-adjust: 100%;
        }

        /* Variables */
        :root {
          --accent-color: #3685B5;  
          /* Dark Slate Gray */
          --default-color: #2B2D54;

          --em-color: #0471A6;
          --highlight-color: #5C9FB3;

          --alt-color: DimGray;
          /* offwhite */
          --bg-color: #fefefe;
        }

        *,
        *::before,
        *::after {
            box-sizing: inherit;
        }


        body {

            /* Nice light gray background to offset the text a little */
            background-color: var(--bg-color);
            color: var(--default-color);
            margin: 0 auto;
            max-width: 50em;

            /* System fonts as fallbacks */
            font-family: "Lato", sans-serif;
            line-height: 1.5;
            padding: 2em 1em;
            scroll-behavior: smooth;
        }

        h1,
        h2,
        strong {
            color: var(--default-color);
            font-family: "Muli", sans-serif;
        }

        h2 {
            margin-top: 1em;
        }

        a {
            color: var(--em-color);
        }

        a:hover {
            color: var(--highlight-color);
        }

        h2 a {
          text-decoration: none;
          color: var(--default-color);
        }

        .headshot {
            float: right;
            width: 14em;
            padding-left: 2em;
        }

        .headshot img {
            width: 100%;
        }

        @media (max-width: 650px) {
            .headshot {
                width: 10em;
            }
        }

        header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-flow: row;
        }

        @media (max-width: 650px) {
            header {
                display: flex;
                align-items: baseline;
                flex-flow: column;
            }

            .social-links {
                margin-top: 0.5em;
            }
        }

        @media (max-width: 390px) {
            header {
                width: 8em;
            }

            .social-links {
                width: 8em;
            }
        }

        .social-links a {
            text-decoration: none;
        }

        svg {
            margin-left: 7px;
            margin-right: 7px;
            height: 25px;
            width: 25px;
        }

        svg path {
            fill: var(--accent-color);
        }

        section ul {
          list-style: none;
        }

        section ul li {
          margin: 0 0 1.3em 0;
          line-height: 1;
        }

        section ul li p {
          color: var(--alt-color);
          font-size: 0.8em;
          padding: none;
        }

        section ul li p date {
          color: var(--default-color);
          font-style: normal;
        }

        section ul li cite {
          font-style: normal;
        }
    </style>

</head>

<body>

    <!-- Header with social links -->
    <header>
        <h1 style="margin-top: 0px; margin-bottom: 4px">Alexander A. Alemi's Blog</h1>
            <a href="rss.xml" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="256px" height="250px"
                    viewBox="0 0 24 24" version="1.1" preserveAspectRatio="xMidYMid">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-12.832 20c-1.197 0-2.168-.969-2.168-2.165s.971-2.165 2.168-2.165 2.167.969 2.167 2.165-.97 2.165-2.167 2.165zm5.18 0c-.041-4.029-3.314-7.298-7.348-7.339v-3.207c5.814.041 10.518 4.739 10.561 10.546h-3.213zm5.441 0c-.021-7.063-5.736-12.761-12.789-12.792v-3.208c8.83.031 15.98 7.179 16 16h-3.211z"/>
                    </svg>
            </a>
    </header>

    <!-- Bio and stuff -->
    <main>
      <p>Some of my thoughts...</p>
    </main>

    <!--- Writings section --->
    <section id="writing">
        <h2><a href="#writing">Writing</a></h2>

        <ul>
        {% for a in posts %}
          {% if a.src %}
            <li>
             <cite><a href="{{ a.src.replace('.md', '.html') }}">{{ a.title }}</a></cite>
             <p>
               <date>{{ a.date }}</date>
               {{ a.description }}
             </p>
            </li>
          {% endif %}
        {% endfor %}
  
        </ul>

    </section>

</body>
</html>
