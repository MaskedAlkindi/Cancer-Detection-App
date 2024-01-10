import { useEffect } from "react";
import { View } from "react-native";
import { RegularText } from "../global";

type ProgressProps = {
  value: number;
  showProgressIndicator?: boolean;
};

export default function Progress({
  value,
  showProgressIndicator = false,
}: ProgressProps) {
  useEffect(() => {
    console.log("progress:", value);
  }, [value]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: showProgressIndicator ? "row" : undefined,
        alignItems: showProgressIndicator ? "center" : undefined,
        gap: showProgressIndicator ? 8 : 0,
      }}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            width: "100%",
            borderWidth: 1,
            borderColor: "#d3d3d3",
            height: 16,
            borderRadius: 99,
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${value}%`,
              backgroundColor: "#000",
              borderRadius: 99,
              borderTopRightRadius: value === 100 ? 99 : 0,
              borderBottomRightRadius: value === 100 ? 99 : 0,
            }}
          />
        </View>
      </View>

      {showProgressIndicator && (
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 0.5,
            borderColor: "#d3d3d3",
          }}
        >
          <RegularText style={{ fontSize: 12 }}>{value}</RegularText>
        </View>
      )}
    </View>
  );
}
