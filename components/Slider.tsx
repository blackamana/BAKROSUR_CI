import { Platform, StyleSheet, View } from 'react-native';
import NativeSlider from '@react-native-community/slider';
import { useState, useEffect } from 'react';

interface SliderProps {
  style?: any;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
}

export default function Slider(props: SliderProps) {
  if (Platform.OS === 'web') {
    return <WebSlider {...props} />;
  }
  
  return <NativeSlider {...props} />;
}

function WebSlider({
  style,
  minimumValue,
  maximumValue,
  step = 1,
  value,
  onValueChange,
  minimumTrackTintColor = '#009E60',
  maximumTrackTintColor = '#E0E0E0',
  thumbTintColor = '#009E60',
}: SliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: any) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue);
    onValueChange(newValue);
  };

  const percentage = ((localValue - minimumValue) / (maximumValue - minimumValue)) * 100;

  return (
    <View style={[styles.container, style]}>
      <input
        type="range"
        min={minimumValue}
        max={maximumValue}
        step={step}
        value={localValue}
        onChange={handleChange}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          outline: 'none',
          WebkitAppearance: 'none',
          appearance: 'none',
          background: `linear-gradient(to right, ${minimumTrackTintColor} 0%, ${minimumTrackTintColor} ${percentage}%, ${maximumTrackTintColor} ${percentage}%, ${maximumTrackTintColor} 100%)`,
          cursor: 'pointer',
        } as any}
        className="custom-slider"
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${thumbTintColor};
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .custom-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${thumbTintColor};
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .custom-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 6px;
          cursor: pointer;
          border-radius: 3px;
        }

        .custom-slider::-moz-range-track {
          width: 100%;
          height: 6px;
          cursor: pointer;
          border-radius: 3px;
        }

        .custom-slider:focus {
          outline: none;
        }

        .custom-slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(0, 158, 96, 0.2);
        }

        .custom-slider:focus::-moz-range-thumb {
          box-shadow: 0 0 0 3px rgba(0, 158, 96, 0.2);
        }
      ` }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
});
