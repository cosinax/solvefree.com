import { SimpleConverter } from "@/components/SimpleConverter";

export default function CookingPage() {
  return (
    <SimpleConverter
      title="Cooking Converter"
      description="Convert between cups, tablespoons, teaspoons, milliliters, fluid ounces, and more."
      units={{ "US Cups": 236.588, "US Tablespoons": 14.7868, "US Teaspoons": 4.92892, "US Fluid Oz": 29.5735, Milliliters: 1, Liters: 1000, "Imperial Cups": 284.131, "Imperial Tablespoons": 17.7582, "Imperial Teaspoons": 5.91939 }}
      defaultFrom="US Cups"
      defaultTo="Milliliters"
    />
  );
}
