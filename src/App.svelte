<script>
  import About from "./components/About.svelte";
  import NavBar from "./components/NavBar.svelte";
  import Projects from "./components/Projects.svelte";
  import Socials from "./components/Socials.svelte";
</script>

<main>
  <NavBar />
  <div>
    <About name={"Salvador Felipe"} />
    <Projects />
    <Socials />
  </div>
</main>

<style>
  main {
    margin: 1rem;
    font-size: 1.25rem;
  }
</style>
