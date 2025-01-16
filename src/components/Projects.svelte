<script>
  const projects = [
    {
      title: "KC Studios - Sun's Edge",
      role: "Systems Developer",
      description: "Designed and implemented gameplay systems using Unreal Engine 5's Blueprints.",
      url: "https://www.kcstudios.games/",
    },
    {
      title: "Intro to Game Design",
      role: "Student Programmer",
      description: "Developed simple games using Python and PyGame",
      url: "https://github.com/SalFell/CPSC-386-Game-Design",
    },
  ];
</script>

<section class="container__projects" id="Projects">
  <p class="header--big">Projects</p>
  {#each projects as { title, role, description, url }}
    <div class="container__project">
      <a href={url} target="_blank">
        <p class="header__title">{title}</p>
      </a>
      <p>{role}</p>
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
    color: aliceblue;
  }
  .container__project {
    background-color: #2C91C6;
    border-radius: 2rem;
    margin: 1rem;
  }
  .header__title {
    font-size: 1.5rem;
    font-weight: 600;
  }
</style>
