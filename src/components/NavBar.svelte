<script>
  // @ts-nocheck
  history.scrollRestoration = "manual" // Prevent automatic scrolling
  const navItems = [
    { title: "Projects", url: "#Projects" }, // Scroll to section with id Projects
    { title: "About", url: "#About" }, // Scroll to section with id About
  ];

  const socials = [
    {
      title: "Github",
      url: "https://github.com/SalFell",
      image:"https://cdn.cdnlogo.com/logos/g/55/github.svg"
    },
    {
      title: "LinkedIn",
      url: "https://www.linkedin.com/in/salvador-felipe-38b396217",
      image: "https://cdn-icons-png.flaticon.com/512/174/174857.png"
    }
  ];
</script>

<nav>
  <section class="container__nav" id="/">
    <p class="header--big">Salvador Felipe</p>
    <ol class="container__nav" id="/">
      {#each navItems as { title, url }}
        <li>
          <a href={url} class="nav__item">
            {title}
          </a>
        </li>
      {/each}
  </ol>
  <div class="container__social">
    {#each socials as { title, url, image }}
        <a href={url} target="_blank">
          <img src={image} alt={title} width="40" height="40"/>
        </a>
    {/each}
  </div>
  </section>
</nav>

<style>
   ol {
    list-style: none;
  }
  li {
    padding: 0;
  }
  .container__nav {
    display: flex;
    justify-content: stretch;
    align-items: center;
    flex-direction: row;
  }
  .nav__item {
    color: aliceblue;
    font-weight: 600;
    font-size: 2rem;
    margin: 0 2rem;
    transition: all 400ms;
  }
  .nav__item:hover {
    color: rgb(0, 157, 255);
  }

  .header--big {
    font-size: 2rem;
    color: #2C91C6;
    font-weight: 700;
  }

  .container__social {
    margin: 0rem;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }
</style>
