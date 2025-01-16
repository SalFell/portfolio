<script>
  // @ts-nocheck
  history.scrollRestoration = "manual" // Prevent automatic scrolling
  const navItems = [
    { title: "About", url: "#About" }, // Scroll to section with id About
    { title: "Projects", url: "#Projects" }, // Scroll to section with id Projects
    { title: "Socials", url: "#Socials" }, // Scroll to section with id Socials
  ];
</script>

<nav>
  <section class="container__nav" id="/">
    <ol class="container__nav" id="/">
      {#each navItems as { title, url }}
        <li>
          <a href={url} class="nav__item">
            {title}
          </a>
        </li>
      {/each}
  </ol>
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
    justify-content: center;
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
</style>
