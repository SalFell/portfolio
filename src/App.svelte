<script>
  import About from "./components/About.svelte";
  import NavBar from "./components/NavBar.svelte";
  import Projects from "./components/Projects.svelte";
</script>

<main>
  <NavBar />
  <div>
    <About />
    <Projects />
  </div>
  <p class="disclaimer">All images, logos, and names are used with permission</p>
</main>

<style>
  main {
    margin: 1rem;
    font-size: 1.25rem;
  }
  .disclaimer {
    font-size: 0.75rem;
    color: white;
    text-align: center;
    background-color: black;
  }
</style>
