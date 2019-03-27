export default {
  name: "Loops",
  props: ["loops", "current"],
  methods: {
    check: function(beat) {
      beat.selected = !beat.selected;
    },
    hexToRgb: function(hex, opacity) {
      const HEX_PATTERN = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
      const result = HEX_PATTERN.exec(hex);

      if (!result) {
        return null;
      }

      const rgb = [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
        opacity ? opacity.toString() : "1"
      ];

      console.log();
      return "rgba(" + rgb.join(",") + ")";
    }
  }
};
