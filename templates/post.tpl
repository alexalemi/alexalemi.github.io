<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>blog.alexalemi.com {{title}}</title>
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

        header p {
          align-items: right;
          font-size: 0.6em;
          font-weight: normal;
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

    <script defer src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

</head>

<body>


  <header>
    <h3>Alex Alemi's Blog</h3>
    <nav>
      <a href='../' />Home</a> | 
      <a href='./' />Index</a> |
      <a rel="alternate" type="application/rss+xml" title="blog.AlexAlemi.com" href="https://blog.alexalemi.com/rss.xml" />RSS</a>
    </nav>
  </header>

  <article>
    <header>
      <h1>{{ title }}<h1>
      <p>Alexander A. Alemi. <time datetime='{{ date }}'>{{ date }}</time></p>
    </header>

    {{ content }} 

  </article>

  <footer>
    <p>
    &copy; 2020 Alexander A. Alemi
    </p>
  </footer>



</body>
</html>
