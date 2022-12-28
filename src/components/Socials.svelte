<script>
  const socials = [
    {
      title: "Github Profile",
      url: "https://github.com/SalFell",
    },
    {
      title: "LinkedIn Profile",
      url: "https://www.linkedin.com/in/salvador-felipe-38b396217",
    },
    {
      title: "Email",
      url: "mailto: salvadorfelipe77@hotmail.com",
    },
  ];
</script>

<section class="container__socials" id="Socials">
  <p class="header--big">Socials</p>
  {#each socials as { title, url }}
    <div class="container__project">
      <a href={url} target="_blank">
        <p class="header__title">{title}</p>
      </a>
    </div>
  {/each}
</section>

<style>
  .container__socials {
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
