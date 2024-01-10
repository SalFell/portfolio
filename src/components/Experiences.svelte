<script>
  const exps = [
    {
      title: "Thales Avionics QA/QC Assistant",
      duration: "Jan 2024 - Present",
    },
    {
      title: "Crescent Software Inc. Software Development Intern",
      duration: "June 2023 - Present",
    },
    {
      title: "CSU Fullerton Center for Computational and Applied Mathematics Student Assistant",
      duration: "Aug 2022 - Jan 2024",
    },
    {
      title: "CSU Fullerton HRDI VP Ops Student Assistant",
      duration: "Aug 2021 - Jan 2024",
    },
    {
      title: "CSU Fullerton Math Department Student Assistant",
      duration: "Aug 2021 - May 2022",
    },
    {
      title: "Corovan IT Tech Mover I",
      duration: "Aug 2021 - Jan 2022",
    },
    {
      title: "College of the Sequoias Access and Ability Center Student Assistant",
      duration: "Aug 2019 - Aug 2021",
    },
  ];
</script>

<section class="container__exps" id="Experiences">
  <p class="header--big">Experiences</p>
  {#each exps as { title, duration }}
    <div class="container__exp">
      <p class="header__title">{title}</p>
      <p class="header__duration">{duration}</p>
    </div>
  {/each}
</section>

<style>
  .container__exps {
    margin-top: 10rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .header--big {
    font-size: 2.5rem;
    font-weight: 780;
  }
  .container__exp {
    background-color: #2C91C6;
    border-radius: 2rem;
    margin: 1rem;
  }
  .header__title {
    font-size: 1.5rem;
    font-weight: 600;
  }
</style>
