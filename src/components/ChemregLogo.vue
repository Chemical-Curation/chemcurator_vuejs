<template>
  <svg
    :viewBox="viewBox"
    preserveAspectRatio="xMidYMid meet"
    :height="size"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="shadow">
      <feDropShadow dx="4" dy="3" stdDeviation="3" flood-opacity="0.2" />
    </filter>
    <g filter="url(#shadow)">
      <g :stroke="color" stroke-width="5" fill="none">
        <ellipse cx="50" cy="60" rx="15" ry="45">
          <animate
            attributeName="rx"
            values="15; 15; 15; 30; 45; 30; 15; 0; 15; 15; 15; 15"
            dur="10s"
            repeatCount="indefinite"
            v-if="animate"
          />
        </ellipse>
        <ellipse cx="50" cy="60" rx="15" ry="45" transform="rotate(60,50,60)">
          <animate
            attributeName="rx"
            values="15; 15; 0; 15; 30; 15; 15; 15"
            dur="10s"
            repeatCount="indefinite"
            v-if="animate"
          />
        </ellipse>
        <ellipse cx="50" cy="60" rx="15" ry="45" transform="rotate(120,50,60)">
          <animate
            attributeName="rx"
            values="15; 15; 30; 15; 0; 15; 15; 15"
            dur="10s"
            repeatCount="indefinite"
            v-if="animate"
          />
        </ellipse>
      </g>
      <circle cx="50" cy="60" r="5" :fill="color" />
      <text
        :fill="color"
        dominant-baseline="central"
        font-size="3em"
        font-weight="lighter"
        x="105"
        y="60"
      >
        chemreg
      </text>
    </g>
  </svg>
</template>

<script>
export default {
  name: "ChemregLogo",
  props: {
    color: {
      type: String,
      default: "black"
    },
    size: {
      type: String,
      default: "100%"
    },
    includeText: {
      type: Boolean,
      default: true
    },
    animate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    viewBox: function() {
      return `0 0 ${this.includeText ? "340" : "100"} 120`;
    }
  }
};
</script>

<style scoped></style>
