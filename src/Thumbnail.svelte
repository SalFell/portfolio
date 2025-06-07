<script>
	export let thumbImg;
	export let altTag;
	export let titleLink;
	export let id;
	export let selected;
</script>

<style>
/* Five columns side by side */
.thumbnail-cont {
    width: 20%;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	background-color: #2C91C6;
}

/* Add a transparency effect for thumnbail images */
.sample {
  opacity: 0.4;
}
	
.sample:hover {
  opacity: 1;
}
	
img {
	width: auto;
	height: auto;
	transition: all .1s ease-in-out;
}	
	
/* Add a pointer when hovering over the thumbnail images */
.cursor {
  cursor: pointer;
}	

.active {
  opacity: 1;
	padding: 5px;
	width: 85%;
	height: 85%;
}
</style>


<div class="thumbnail-cont">
	<button
		type="button"
		class="sample cursor"
		class:active={selected}
		id={id}
		title="Image from {titleLink}"
		aria-label={altTag}
	>
		<img
			src={thumbImg}
			alt={altTag}
			style="width: 100%; height: 100%; pointer-events: none;"
			draggable="false"
		/>
	</button>
</div>