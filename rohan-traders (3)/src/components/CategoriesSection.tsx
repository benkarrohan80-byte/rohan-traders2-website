import React from 'react';
import { 
  Boxes, 
  Package, 
  FileText, 
  HelpCircle 
} from 'lucide-react';
import { SCRAP_CATEGORIES } from '../data/scrapCategories';
import { ScrapCategory } from '../types';

interface CategoriesSectionProps {
  onSelectCategory: (categoryName: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onSelectCategory }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Boxes':
        return <Boxes className="w-6 h-6 text-orange-500" />;
      case 'Package':
        return <Package className="w-6 h-6 text-orange-500" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-orange-500" />;
      default:
        return <HelpCircle className="w-6 h-6 text-orange-500" />;
    }
  };

  return (
    <section className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Scrap Items We Buy <span className="block text-xl sm:text-2xl text-orange-600 font-bold mt-1">(हम क्या-क्या खरीदते हैं)</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-3 font-medium">
            We purchase scrap categories at best market rates
            <span className="block text-sm text-gray-500 font-normal mt-0.5">(सभी प्रकार का स्क्रैप खरीदें - सबसे बढ़िया रेट पर)</span>
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCRAP_CATEGORIES.map((cat: ScrapCategory) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xs hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer group flex flex-col justify-between"
            >
              {cat.imageUrl ? (
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                  <img 
                    src={cat.imageUrl} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white drop-shadow-xs">
                      {cat.name}
                    </h3>
                    <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center shrink-0">
                      {React.cloneElement(getIcon(cat.iconName), {
                        className: "w-5 h-5 text-orange-600"
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 pb-0">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-orange-500 transition-all">
                    {React.cloneElement(getIcon(cat.iconName), {
                      className: "w-7 h-7 text-orange-500 group-hover:text-white transition-colors"
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              )}

              <div className="p-6 pt-4 flex-1 flex flex-col justify-end">
                {cat.estimatedRate && (
                  <div className="border-t border-gray-100 pt-3 flex flex-col gap-1 text-xs text-gray-500 font-medium">
                    <div className="flex items-center justify-between">
                      <span>Estimated Rate:</span>
                      <span className="text-orange-600 font-bold bg-orange-50 px-2.5 py-1 rounded-full">
                        {cat.estimatedRate}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 text-right font-normal">
                      * Rates depend on item condition (कंडीशन के अनुसार)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Note Section (Below scrap types / Above How It Works) */}
        <div className="mt-10 text-center">
          <div className="bg-orange-50 border border-orange-200/60 rounded-2xl p-4 inline-block text-xs sm:text-sm text-orange-800 font-semibold shadow-2xs max-w-xl mx-auto">
            📢 Note: Exact rates depend on the material condition & quality
            <span className="block text-xs font-normal text-orange-700 mt-0.5">(नोट: अंतिम रेट स्क्रैप माल की कंडीशन और क्वालिटी के हिसाब से तय होगा)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
