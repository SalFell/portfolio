<script>
  const projects = [
    {
      title: "KC Studios - Sun's Edge",
      description: "Developed multitude of character abilities and status effects.",
      url: "https://www.kcstudios.games/",
    },
    {
      title: "trAIder",
      description: "Created stock market strategy analyzer using Node.js and React",
      url: "https://github.com/SalFell/CPSC362",
    },
    {
      title: "Intro to Game Design",
      description: "Developed simple games using Python and PyGame",
      url: "https://github.com/SalFell/CPSC-386-Game-Design",
    },
  ];
</script>

<section class="container__projects" id="Projects">
  <p class="header--big">Projects</p>
  {#each projects as { title, description, url }}
    <div class="container__project">
      <a href={url} target="_blank">
        <p class="header__title">{title}</p>
      </a>
      <p>{description}</p>
    </div>
  {/each}
</section>

<style>
  .container__projects {
    margin-top: 10rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .header--big {
    font-size: 2.5rem;
    font-weight: 780;
  }
  .container__project {
    margin: 1rem;
  }
  .header__title {
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    transition: 400ms all;
  }
  .header__title:hover {
    color: #2c91c6;
  }
</style>
