<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>alexalemi.com</title>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-153903138-1"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-153903138-1');
    </script>

		<!-- favicon stuff -->
		<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
		<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
		<link rel="manifest" href="/site.webmanifest">
		<meta name="msapplication-TileColor" content="#da532c">
		<meta name="theme-color" content="#ffffff">

    <!-- RSS Feed -->
    <link rel="alternate" type="application/rss+xml" title="AlexAlemi.com" href="https://alexalemi.com/rss.xml" />

    <!-- Search Engine -->
    <meta name="description" content="Alexander A. Alemi, Research Scientist">
    <meta name="image" content="https://alexalemi.com/images/me_small.jpg">

    <!-- Schema.org for Google -->
    <meta itemprop="name" content="alexalemi.com">
    <meta itemprop="description" content="Alexander A. Alemi, Research Scientist">
    <meta itemprop="image" content="https://alexalemi.com/images/me_small.jpg">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="alexalemi.com">
    <meta name="twitter:description" content="Alexander A. Alemi, Research Scientist">
    <meta name="twitter:creator" content="alemi">
    <meta name="twitter:image:src" content="https://alexalemi.com/images/me_small.jpg">

    <!-- Open Graph general (Facebook, Pinterest & Google+) -->
    <meta name="og:title" content="alexalemi.com">
    <meta name="og:description" content="Alexander A. Alemi, Research Scientist">
    <meta name="og:image" content="https://alexalemi.com/images/me_small.jpg">
    <meta name="og:url" content="https://alexalemi.com">
    <meta name="og:site_name" content="alexalemi.com">
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
						fill: var(--accent-color);
        }

        /*
				svg path {
            fill: var(--accent-color);
        }

				svg g path .white {
					fill: var(--bg-color);
				}
				*/

        section ul {
          list-style: none;
        }

        section ul li {
          margin: 0 0 1.3em 0;
          line-height: 1.5;
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

        footer {
          color: var(--alt-color);
          font-size: 0.8em;
          text-align: center;
        }
    </style>


</head>

<body>

    <!-- Headshot -->
    <div class="headshot">
        <a href="assets/images/me.jpg"><img src="assets/images/me_round.jpg" alt="Alex Alemi Headshot" title="Alex Alemi Headshot" /></a>
    </div>

    <!-- Header with social links -->
    <header>
        <h1 style="margin-top: 0px; margin-bottom: 4px">Alexander A. Alemi</h1>

        <div class="social-links">
            <a href="mailto:me@alexalemi.com"> <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 36 24">
                    <g>
                        <path class="cls-1" d="M18,13.47,34.52.25A2.55,2.55,0,0,0,33.43,0H2.57a2.55,2.55,0,0,0-1.1.25Z"></path>
                        <path class="cls-1" d="M35.74,1.46l-.06.07L18.54,15.24a.86.86,0,0,1-1.07,0L.32,1.53.26,1.46A2.54,2.54,0,0,0,0,2.57V21.43A2.57,2.57,0,0,0,2.57,24H33.43A2.57,2.57,0,0,0,36,21.43V2.57A2.55,2.55,0,0,0,35.74,1.46Z"></path>
                    </g>
                </svg> </a>
                <a href="https://scholar.google.com/citations?user=68hTs9wAAAAJ" target="_blank"> <svg
                    xmlns="http://www.w3.org/2000/svg" width="260" height="300" viewBox="0 0 260 300">
                    <path d="M103.72829,298.88172 C76.34128,296.29847 55.07609,284.76559 45.35826,267.22554 C41.88286,260.95267 41.53217,259.17959 41.53217,247.88048 C41.53217,236.92091 41.98334,234.4643 45.32507,227.22802 C55.34292,205.5351 81.81566,191.58318 121.07774,187.30412 C128.8195,186.46036 135.15369,185.29711 135.15369,184.71913 C135.15369,184.14113 133.53332,181.17574 131.55287,178.12935 C128.28338,173.10012 127.95204,171.47589 127.95204,160.47801 L127.95204,148.36556 L120.66352,148.36613 C95.21126,148.36813 75.12542,136.82734 65.03001,116.40067 C61.35084,108.95637 60.18949,104.78799 59.59142,96.88019 L58.83097,86.82528 L29.89344,86.82528 L0.95591,86.82528 L44.15096,43.61534 L87.346,0.40541 L173.73232,0.40541 L260.11864,0.40541 L252.63063,7.97238 L245.14262,15.53935 L245.14262,26.8935 C245.14262,35.05352 245.64139,38.54221 246.91555,39.29476 C251.32526,41.89915 251.68958,45.81489 251.68958,90.60576 C251.68958,120.92264 251.21713,136.18648 250.21033,138.39615 C246.89693,145.66826 235.53195,145.66826 232.21855,138.39615 C230.12498,133.80126 230.16142,47.62569 232.25885,43.02226 C233.09461,41.18796 234.27307,39.68717 234.87763,39.68717 C235.4822,39.68717 235.97151,36.29911 235.96499,32.15816 L235.95319,24.62916 L216.93681,43.74684 C198.13874,62.64504 197.93843,62.9081 199.48873,66.66119 C200.35263,68.75261 201.07886,76.63301 201.10567,84.20649 C201.18037,105.2887 199.00077,109.8059 179.53153,128.9215 C163.79908,144.36813 161.34149,147.91827 161.34149,155.19815 C161.34149,159.77841 166.77833,165.59815 186.76371,182.41089 C200.69031,194.12665 207.39839,202.24827 210.82478,211.54212 C214.67985,221.99874 215.3643,230.71556 213.16028,241.28612 C205.02561,280.30018 159.69108,304.16036 103.72825,298.88172 L103.72829,298.88172 Z M147.82552,283.18755 C154.75843,282.26978 161.10718,280.35673 167.47343,277.26712 C182.12774,270.15523 188.86239,259.963 188.81001,244.97642 C188.75861,230.27494 182.21614,220.86779 161.11753,205.15845 L149.39848,196.43284 L134.74707,197.20777 C111.70669,198.42641 95.8907,203.69967 84.90527,213.8257 C76.58521,221.49484 73.60929,228.25646 73.62507,239.4555 C73.65787,262.75366 92.18981,279.06402 123.36916,283.23638 C134.11128,284.67388 136.63593,284.66884 147.82552,283.18758 L147.82552,283.18755 Z M151.85933,133.13328 C155.64618,131.31754 160.26234,127.84197 162.11749,125.40975 C175.33106,108.08587 168.93712,68.34304 149.51809,47.09552 C141.02561,37.80341 132.23698,33.87543 122.01307,34.80251 C102.63987,36.55921 91.52619,50.26903 91.51737,72.42196 C91.50517,103.13522 108.02842,131.43235 129.04142,136.68421 C135.22411,138.22947 144.11702,136.84554 151.85933,133.13328 Z"
                        transform="translate(-1)" /></svg> </a>

                        <a href="https://x.com/alemi" target="_blank">
												<svg xmlns="http://www.w3.org/2000/svg" width="256px" height="209px" viewBox="0 0 300 271">
 <path d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z"/>
</svg>
            </a>

                        <a rel="me" href="https://bsky.app/profile/alexalemi.bsky.social" target="_blank">
												<svg xmlns="http://www.w3.org/2000/svg" width="256px" height="209px" viewBox="0 0 600 530" version="1.1">
 <path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z" />
</svg>
            </a>

                        <!-- <a rel="me" href="https://sigmoid.social/@alemi" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="256px" height="209px"
                    viewBox="0 0 216.4144 232.00976" version="1.1" preserveAspectRatio="xMidYMid">
												<g>
												<path xmlns="http://www.w3.org/2000/svg" id="path19" style="stroke-width:1.06667" d="M 115.05664 0 C 83.417974 0.25866667 52.984047 3.6847447 35.248047 11.830078 C 35.248047 11.830078 0.072265625 27.564666 0.072265625 81.25 C 0.072265625 93.543333 -0.16667709 108.24208 0.22265625 123.83008 C 1.4999896 176.33141 9.8473382 228.07387 58.388672 240.92188 C 80.770005 246.84588 99.986891 248.08699 115.46289 247.23633 C 143.52822 245.68033 159.2832 237.2207 159.2832 237.2207 L 158.35742 216.85742 C 158.35742 216.85742 138.30134 223.18082 115.77734 222.41016 C 93.461344 221.64482 69.902302 220.00414 66.292969 192.60547 C 65.959635 190.1988 65.792969 187.62454 65.792969 184.92188 C 65.792969 184.92187 87.700224 190.27683 115.46289 191.54883 C 132.43889 192.32749 148.35801 190.55433 164.52734 188.625 C 195.53534 184.92233 222.5344 165.81671 225.92773 148.35938 C 231.2744 120.85937 230.83398 81.25 230.83398 81.25 C 230.83398 27.564666 195.66016 11.830078 195.66016 11.830078 C 177.92549 3.6847447 147.47265 0.25866667 115.83398 0 L 115.05664 0 z M 79.25 41.947266 C 92.428667 41.947266 102.40719 47.012531 109.00586 57.144531 L 115.42188 67.898438 L 121.83789 57.144531 C 128.43522 47.012531 138.41375 41.947266 151.59375 41.947266 C 162.98308 41.947266 172.15997 45.951052 179.16797 53.761719 C 185.9613 61.572385 189.34375 72.130682 189.34375 85.416016 L 189.34375 150.41992 L 163.58984 150.41992 L 163.58984 87.326172 C 163.58984 74.026172 157.99411 67.275391 146.80078 67.275391 C 134.42478 67.275391 128.22266 75.282521 128.22266 91.117188 L 128.22266 125.65234 L 102.62109 125.65234 L 102.62109 91.117188 C 102.62109 75.282521 96.417016 67.275391 84.041016 67.275391 C 72.847682 67.275391 67.251953 74.026172 67.251953 87.326172 L 67.251953 150.41992 L 41.498047 150.41992 L 41.498047 85.416016 C 41.498047 72.130682 44.881115 61.572385 51.675781 53.761719 C 58.682448 45.951052 67.859333 41.947266 79.25 41.947266 z " transform="scale(0.93749999)"/>
		</g>
                </svg>
            </a> -->

            <a href="http://github.com/alexalemi" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="256px" height="250px"
                    viewBox="0 0 256 250" version="1.1" preserveAspectRatio="xMidYMid">
                    <g>
                        <path d="M128.00106,0 C57.3172926,0 0,57.3066942 0,128.00106 C0,184.555281 36.6761997,232.535542 87.534937,249.460899 C93.9320223,250.645779 96.280588,246.684165 96.280588,243.303333 C96.280588,240.251045 96.1618878,230.167899 96.106777,219.472176 C60.4967585,227.215235 52.9826207,204.369712 52.9826207,204.369712 C47.1599584,189.574598 38.770408,185.640538 38.770408,185.640538 C27.1568785,177.696113 39.6458206,177.859325 39.6458206,177.859325 C52.4993419,178.762293 59.267365,191.04987 59.267365,191.04987 C70.6837675,210.618423 89.2115753,204.961093 96.5158685,201.690482 C97.6647155,193.417512 100.981959,187.77078 104.642583,184.574357 C76.211799,181.33766 46.324819,170.362144 46.324819,121.315702 C46.324819,107.340889 51.3250588,95.9223682 59.5132437,86.9583937 C58.1842268,83.7344152 53.8029229,70.715562 60.7532354,53.0843636 C60.7532354,53.0843636 71.5019501,49.6441813 95.9626412,66.2049595 C106.172967,63.368876 117.123047,61.9465949 128.00106,61.8978432 C138.879073,61.9465949 149.837632,63.368876 160.067033,66.2049595 C184.49805,49.6441813 195.231926,53.0843636 195.231926,53.0843636 C202.199197,70.715562 197.815773,83.7344152 196.486756,86.9583937 C204.694018,95.9223682 209.660343,107.340889 209.660343,121.315702 C209.660343,170.478725 179.716133,181.303747 151.213281,184.472614 C155.80443,188.444828 159.895342,196.234518 159.895342,208.176593 C159.895342,225.303317 159.746968,239.087361 159.746968,243.303333 C159.746968,246.709601 162.05102,250.70089 168.53925,249.443941 C219.370432,232.499507 256,184.536204 256,128.00106 C256,57.3066942 198.691187,0 128.00106,0 Z M47.9405593,182.340212 C47.6586465,182.976105 46.6581745,183.166873 45.7467277,182.730227 C44.8183235,182.312656 44.2968914,181.445722 44.5978808,180.80771 C44.8734344,180.152739 45.876026,179.97045 46.8023103,180.409216 C47.7328342,180.826786 48.2627451,181.702199 47.9405593,182.340212 Z M54.2367892,187.958254 C53.6263318,188.524199 52.4329723,188.261363 51.6232682,187.366874 C50.7860088,186.474504 50.6291553,185.281144 51.2480912,184.70672 C51.8776254,184.140775 53.0349512,184.405731 53.8743302,185.298101 C54.7115892,186.201069 54.8748019,187.38595 54.2367892,187.958254 Z M58.5562413,195.146347 C57.7719732,195.691096 56.4895886,195.180261 55.6968417,194.042013 C54.9125733,192.903764 54.9125733,191.538713 55.713799,190.991845 C56.5086651,190.444977 57.7719732,190.936735 58.5753181,192.066505 C59.3574669,193.22383 59.3574669,194.58888 58.5562413,195.146347 Z M65.8613592,203.471174 C65.1597571,204.244846 63.6654083,204.03712 62.5716717,202.981538 C61.4524999,201.94927 61.1409122,200.484596 61.8446341,199.710926 C62.5547146,198.935137 64.0575422,199.15346 65.1597571,200.200564 C66.2704506,201.230712 66.6095936,202.705984 65.8613592,203.471174 Z M75.3025151,206.281542 C74.9930474,207.284134 73.553809,207.739857 72.1039724,207.313809 C70.6562556,206.875043 69.7087748,205.700761 70.0012857,204.687571 C70.302275,203.678621 71.7478721,203.20382 73.2083069,203.659543 C74.6539041,204.09619 75.6035048,205.261994 75.3025151,206.281542 Z M86.046947,207.473627 C86.0829806,208.529209 84.8535871,209.404622 83.3316829,209.4237 C81.8013,209.457614 80.563428,208.603398 80.5464708,207.564772 C80.5464708,206.498591 81.7483088,205.631657 83.2786917,205.606221 C84.8005962,205.576546 86.046947,206.424403 86.046947,207.473627 Z M96.6021471,207.069023 C96.7844366,208.099171 95.7267341,209.156872 94.215428,209.438785 C92.7295577,209.710099 91.3539086,209.074206 91.1652603,208.052538 C90.9808515,206.996955 92.0576306,205.939253 93.5413813,205.66582 C95.054807,205.402984 96.4092596,206.021919 96.6021471,207.069023 Z"></path>
                    </g>
                </svg>
            </a>

            <a href="rss.xml" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="256px" height="250px"
                    viewBox="0 0 24 24" version="1.1" preserveAspectRatio="xMidYMid">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-12.832 20c-1.197 0-2.168-.969-2.168-2.165s.971-2.165 2.168-2.165 2.167.969 2.167 2.165-.97 2.165-2.167 2.165zm5.18 0c-.041-4.029-3.314-7.298-7.348-7.339v-3.207c5.814.041 10.518 4.739 10.561 10.546h-3.213zm5.441 0c-.021-7.063-5.736-12.761-12.789-12.792v-3.208c8.83.031 15.98 7.179 16 16h-3.211z"/>
                    </svg>
            </a>
        </div>
    </header>

    <!-- Bio and stuff -->
    <main>

        <p>
            I work at <a href="https://www.anthropic.com/">Anthropic</a>. Formerly at <a href="https://ai.google/research/people/104980/">Google Deepmind</a> and <a href="https://la.disneyresearch.com/alumni/">Disney Research</a>. My current focus is Scaling and the intersection of Information Theory and Deep Learning.
            I got my Ph.D. in Theoretical Condensed Matter Physics at Cornell University,
            supervised by <a href="http://sethna.lassp.cornell.edu/">Jim Sethna</a>.
            I got my B.S. at Caltech, where I majored in Physics.
        </p>

				<p>Below you'll find a list of my publications and other writings, for my recent writing, see my <a href="https://blog.alexalemi.com">blog</a>.</p>

    </main>

    <!-- Section navigation using anchors -->
    <nav style="margin-top: 1.5em;">
        <p>
            <strong>Jump to: </strong>
            <a href="#research">Research</a> |
            <a href="#writing">Writing</a> |
            <a href="#code">Code</a> |
            <a href="#talks">Talks</a> |
            <!-- <a href="#poster-presentations">Poster Presentations</a> | -->
            <a href="#etc">Etc.</a>
        </p>
    </nav>

    <!-- Publications section -->
    <section id="research">
        <h2><a href="#research">Research</a></h2>


        <ul>
        {% for a in research %}
            <li>
             <cite>{{ a.title }}</cite>
             {% if a.arxiv %}
                 <a href="https://arxiv.org/abs/{{ a.arxiv }}">[arxiv]</a>
             {% endif %}
             {% if a.file %}
                 <a href="publications/{{ a.file }}">[pdf]</a>
             {% endif %}
             {% for link in a.links %}
                 <a href="{{ link.href }}">{{ link.text }}</a>
             {% endfor %}
             <p>
               {{ a.authors }}
               <date>{{ a.date }}</date>
               <strong>{{ a.venue }}</strong>
             </p>
             <p>
               {{ a.description }}
             </p>
            </li>
        {% endfor %}
  
        </ul>

    </section>
    <!--- Writings section --->
    <section id="writing">
        <h2><a href="#writing">Writing</a></h2>
        <p>For more writing, see my <a href="https://blog.alexalemi.com">blog</a>.</p>

        <ul>
        {% for a in writing %}
          {% if not a.hidden and a.featured and not a.draft %}
            <li>
             <cite>{{ a.title }}</cite>
             {% for link in a.links %}
                 <a href="{{ link.href }}">{{ link.text }}</a>
             {% endfor %}
             <p>
               <date>{{ a.date }}</date>
               {{ a.description }}
             </p>
            </li>
          {% endif %}
        {% endfor %}
  
        </ul>

    </section>
    <!-- Code projects section -->
    <section id="code">
        <h2><a href="#code">Code</a></h2>

        <p>I've contributed to various Google Opensource projects including: 
        <a href="https://github.com/google-deepmind/nanodo" target="_blank">NanoDo</a>,
        <a href="https://github.com/google/jax" target="_blank">JAX</a>,
        <a href="https://github.com/google/neural-tangents" target="_blank">Neural Tangents</a>,
        <a href="https://www.tensorflow.org/probability" target="_blank">Tensorflow Probability</a>,
        <a href="https://www.tensorflow.org/datasets" target="_blank">Tensorflow Datasets</a>,
        and <a href="http://tensorflow.org" target="_blank">TensorFlow</a>.
        </p>

        <p>I also opensourced a top class image classification network: <a href="https://github.com/tensorflow/models/blob/master/research/slim/nets/inception_resnet_v2.py" target="_blank">Inception Resnet V2</a>.
        </p>

				<p>A self-contained Diffusion colab is available <a href="https://github.com/google-research/vdm/blob/main/colab/SimpleDiffusionColab.ipynb">here</a>.</p>

				<p>An open source demo of VIB is available <a href="https://github.com/alexalemi/vib_demo">here</a>.</p>

        <p><a href="https://github.com/alexalemi/pychebfun" target="_blank">pychebfun</a> is 
        an open source reimplimentation of <a href="http://chebfun.org" target="_blank">ChebFun</a>.
        </p>

        <p><a href="https://texpad.alexalemi.com">texpad.alexalemi.com</a> is a simple
        static MathJAX formula as copyable image generator.
        </p>
        <p><a href="https://github.com/alexalemi/advent">alexalemi/advent</a> are my solutions to 
				<a href="https://adventofcode.com">Advent of Code</a>.
        </p>
        


    </section>

    <!-- Talks section -->
    <section id="talks">
        <h2><a href="#talks">Talks</a></h2>
        <ul>

          {% for t in talks %}
              <li>
                <cite>{{ t.title }}</cite>
                {% for link in t.links %}
                    {% if link.canonical %}
                        <a href="talks/{{ t.id }}.html" {% if link.blank %} target="_blank" {% endif %}>{{ link.text }}</a>
                    {% else %}
                        <a href="{{ link.href }}" {% if link.blank %} target="_blank" {% endif %}>{{ link.text }}</a>
                    {% endif %}
                {% endfor %}
                <p>
                  <date>{{ t.date }}</date>
                  <strong>{{ t.venue }}</strong>
                </p>
                <p>
                  {{ t.description }}
                </p>
              </li>
          {% endfor %}

        </ul>
    </section>

    <!-- Poster presentations section -->
    <!-- <section>
        <h2><a href="#poster-presentations" style="text-decoration: none;" id="poster-presentations">#</a> Poster Presentations</h2>


        <p><a href="http://colinraffel.com/posters/iclr2019understanding.pdf">Understanding and Improving Interpolation in Autoencoders via an Adversarial Regularizer</a> at 7th International Conference on Learning Representations, 2019.</p>

    </section> -->


    <!-- Etc. section -->
    <section id="etc">
        <h2><a href="#etc">Etc.</a></h2>

        <ul>

          <li><p>I used to be quite active on the <a href="https://physics.stackexchange.com/users/51994/alemi">Physics Stackexchange</a>.
        </p>

        <li><p><a href="https://espdic.alexalemi.com">Espdic</a> is a simple Esperanto Dictionary.</p>

        <li><p><a href="http://mattbierbaum.github.io/onelook/">One Look</a>: A ludum dare 45 entry.</p>

        <li><p>A <a href="https://mattbierbaum.github.io/zombies-usa/">Zombie Simulator</a> for our paper.</p>

        <li><p><a href="http://thephysicsvirtuosi.com">The Physics Virtuosi</a> 
        was a blog I ran with some friends from graduate school.
        </p>

        <li><p><a href="https://cornell.alexalemi.com">A Mirror of My Old Homepage</a> at Cornell University has some random things.
        </p>

        </ul>

    </section>

		<footer>
			<small><center><p>An <a type="application/rss+xml" title="AlexAlemi.com" href="https://alexalemi.com/rss.xml" />RSS Feed</a> is available for all of my content.</p></center></small>
	  </footer>

    <!-- MathJax -->
    <!-- 
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    -->

</body>
</html>
