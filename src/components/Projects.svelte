<script>
  import { mediaCrabDash } from "../mediaData";
	import Slide from '../Slide.svelte';
	import Thumbnail from '../Thumbnail.svelte';
	import Caption from '../Caption.svelte';

  const projects = [
    {
      title: "KC Studios - Sun's Edge",
      role: "Systems Developer",
      description: "Designed and implemented gameplay systems for character abilities and inventory in Unreal Engine 5\n"+
      "Utilized Trello to track progress and prioritize tasks\n"+
      "Used Unreal's debugger and profiler to identify and fix bugs and optimize performance",
      url: "https://store.steampowered.com/app/2174210/Suns_Edge/",
      ytid: "Gstcu4UTXRQ",
      media: null, // Placeholder for media, can be replaced with actual media if available
    },
    {
      title: "Crab Dash",
      role: "Gameplaye & UI Programmer",
      description: "Developed a third-person puzzle game as part of a game jam themed “Hidden Currency” focusing on core mechanics such as a randomly populated puzzle board, score system, and UI logic using Unreal Engine 5's Blueprints\n"+
      "Setup and managed version control for a team of 6 through Github\n"+
      "Delegated tasks based on priority while ensuring to outline expected task outcomes and to stay within the project's scope",
      url: "https://maruvail.itch.io/crabdash",
      ytid: "llS4CNA1IJU",
      media: mediaCrabDash,
    },
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
      url: "https://salfell.itch.io/lean-and-loot",
      ytid: "U_SxnTr-6J0",
      media: null, // Placeholder for media, can be replaced with actual media if available
    },
  ];

  /* IMAGE TO SHOW */
	let imageShowingIndex = 0;
	$: console.log(imageShowingIndex);
	$: image = mediaCrabDash[imageShowingIndex];
	
	const nextSlide = () => {
		if (imageShowingIndex === mediaCrabDash.length-1) {
			imageShowingIndex = 0;
		} else {
			imageShowingIndex += 1;
		}
	}
	
	const prevSlide = () => {
		if (imageShowingIndex === 0) {
			imageShowingIndex = mediaCrabDash.length-1;
		} else {
			imageShowingIndex -= 1;
		}
	}
	
	const goToSlide = (number) => imageShowingIndex = number;

</script>

<section class="container__projects" id="Projects">
  <p class="header--big">Projects</p>
  {#each projects as { title, role, description, url, ytid, media }}
    <div class="container__project">
      <a href={url} target="_blank">
        <p class="header__title">{title}</p>
      </a>
      <p>{role}</p>
      <!-- Embedding Youtube video -->
      {#if ytid != ""}
        <iframe width="560" height="315" src="https://www.youtube.com/embed/{ytid}?si=aoe9CCV2Ww8U-78k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      {/if}
      <!-- Displaying media if available -->
      {#if media}
        <div class="container">
          <Slide image={image.imgurl} 
						 altTag={image.name} 
						 attr={image.attribution} 
						 slideNo={image.id+1} 
						 totalSlides={mediaCrabDash.length} />
        </div>
        <!-- Image text -->
        <Caption caption={mediaCrabDash[imageShowingIndex].name}
          on:prevClick={prevSlide}
          on:nextClick={nextSlide} />
        <!-- Thumbnail images -->
        <div class="thumbnails-row">
            {#each mediaCrabDash as {id, imgurl, name, attribution}}
              <Thumbnail thumbImg={imgurl} 
                        altTag={name} 
                        titleLink={attribution}
                        {id} 
                        selected={imageShowingIndex === id}
                        on:click={() => goToSlide(id)} />
            {/each}
        </div>
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
  @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@500&display=swap');
	
  * {
    box-sizing: border-box;
    font-family: 'Josefin Sans', sans-serif;
  }
	

  main {
    width: 70vw;
    display: flex;
    flex-direction: column;
    margin: 10% auto;
    background-color: #222;
    box-shadow: 0 0 10px black;
  }	
    
  /* Position the image container (needed to position the left and right arrows) */
  .container {
    position: relative;
  }

  .thumbnails-row {
    width: 100%;
    display: flex;
    align-self: flex-end;
  }	
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
