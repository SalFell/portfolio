<script>
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

<section class="container__socials" id="Socials">
  <p class="header--big">Socials</p>
  <div class="container__social">
    {#each socials as { title, url, image }}
        <a href={url} target="_blank">
          <img src={image} alt={title} width="40" height="40"/>
        </a>
    {/each}
  </div>
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
    color: aliceblue;
  }
  .container__social {
    margin: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }
</style>
