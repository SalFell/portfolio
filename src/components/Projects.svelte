<script>

  const projects = [
    {
      title: "Lean and Loot",
      role: "Solo Developer",
      description: "Developed a movement based first-person stealth demo in Unreal Engine 5\n"+
      "Created game design document and pitch deck outlining core mechanics, minimum viable product, and target audience\n"+
      "Created and maintained production plan using HacknPlan to track progress, prioritize tasks, and setup knowledgebase of design decisions\n"+
      "Blocked out levels first on paper, then in editor\n"+
      "Created metrics gym to help with player movement and level design\n"+
      "Implemented core movement mechanics and AI behavior\n"+
      "Designed and implemented simple UI to navigate the game and adjust visual and audio settings",
      url: "",
      ytid: "",
    },{
      title: "KC Studios - Sun's Edge",
      role: "Systems Developer",
      description: "Designed and implemented gameplay systems for character abilities and inventory in Unreal Engine 5\n"+
      "Utilized Trello to track progress and prioritize tasks\n"+
      "Used Unreal's debugger and profiler to identify and fix bugs and optimize performance",
      url: "https://store.steampowered.com/app/2174210/Suns_Edge/",
      ytid: "Gstcu4UTXRQ",
    },
    {
      title: "Intro to Game Design",
      role: "Student Programmer",
      description: "Developed simple games using Python and PyGame",
      url: "https://github.com/SalFell/CPSC-386-Game-Design",
      ytid: "",
    },
  ];
</script>

<section class="container__projects" id="Projects">
  <p class="header--big">Projects</p>
  {#each projects as { title, role, description, url, ytid }}
    <div class="container__project">
      <a href={url} target="_blank">
        <p class="header__title">{title}</p>
      </a>
      <p>{role}</p>
      <!-- Embedding Youtube video -->
      {#if ytid != ""}
        <iframe width="560" height="315" src="https://www.youtube.com/embed/{ytid}?si=aoe9CCV2Ww8U-78k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      {/if}
      <ul>
        {#each description.split('\n') as line}
          <li>{line}</li>
        {/each}
      </ul>
      </div>
  {/each}
</section>

<style>
  ul {
    list-style-type: square;
  }
  li {
    margin: 0rem;
    text-align: left;
  }
  .container__projects {
    margin-top: 10rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .header--big {
    font-size: 2.5rem;
    font-weight: 780;
    color: #2C91C6;
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
