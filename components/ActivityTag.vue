<template>
  <div
    class="activity-tag"
  />
</template>

<style lang="scss">
@use "sass:map";

.activity-tag {
  @include subheading-style-4;

  display: inline-block;
  padding: 6px 7px;
  font-weight: 700;
  color: map.get($layout-colors, accent);
  border-radius: 2px;
  background-color: map.get($signal-colors, open);

  &::before {
    content: 'Open Now';

    .closed & {
      content: 'Closed';
    }
  }

  .closed & {
    background-color: map.get($signal-colors, closed);
  }

  @include breakpoint(medium) {
    padding: 0.417vh 0.486vw;
    border-radius: 0.139vw;
  }
}
</style>