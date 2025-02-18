<script>
  // export let name; // receive props ```name```
  import frank from "../assets/selfie.jpg";
</script>

<section>
  <div class="container__about" id="About">
   <!-- We're using the props here -->
    <p class="header--big">About Me</p>
    <img width={200} height={225} src={frank} alt="Headshot of Salvador" />
    <p class="header--small">
      Welcome to my portfolio! <br>
      I am a Computer Science Graduate from CSU Fullerton and am passionate about game systems design and development.
       I started my game development journey in 2019 with simple terminal-based games made using Python. Currently 
       partnered with the indie team at KC Studios primarily as a Systems Developer for the early-access game, 
       Sun's Edge. I have also started my own project, Lean and Loot, which now has a playable demo!
    </p>
  </div>
</section>

<style>
  .container__about {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0rem;
  }
  .header--small {
    font-size: 1.5rem;
    color:aliceblue;
    margin: auto;
    font-weight: 600;
  }

  .header--big {
    font-size: 2rem;
    color: #2C91C6;
    font-weight: 700;
  }
</style>
