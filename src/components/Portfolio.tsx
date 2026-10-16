import React, { useState } from 'react';
import { PROJECTS } from '../data/mockData';
import { ProjectItem } from '../types';
import { MapPin, Clock, Maximize2 } from 'lucide-react';

interface PortfolioProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const categories = [
    { id: 'all', label: 'Все проекты' },
    { id: 'scandinavian', label: 'Скандинавский' },
    { id: 'loft', label: 'Лофт' },
    { id: 'minimalism', label: 'Минимализм' },
    { id: 'classic', label: 'Классика' },
  ];
  const filteredProjects = PROJECTS.filter((p) => activeCategory === 'all' || p.category === activeCategory);

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 max-w-[1440px] mx-auto" id="portfolio">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="font-inter font-bold text-xs uppercase tracking-widest text-[#0369a1] block mb-3">НАШИ РАБОТЫ</span>
          <h2 className="font-montserrat font-bold text-3xl sm:text-4xl text-[#181f21]">Интерьеры и решения</h2>
          <p className="text-sm text-[#747879] mt-3 max-w-lg">Подборка интерьеров, чтобы выбрать стиль будущего ремонта.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded font-montserrat font-bold text-xs transition-all cursor-pointer ${
              activeCategory === cat.id ? 'bg-[#0369a1] text-white shadow-sm' : 'bg-[#eeeeee] text-[#434749] hover:bg-[#e2e2e2]'
            }`} id={`portfolio-cat-${cat.id}`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {filteredProjects.map((project) => (
          <button type="button" aria-label={`Открыть галерею: ${project.title}`} key={project.id} onClick={() => onSelectProject(project)} className="group overflow-hidden rounded-lg bg-white border border-[#c3c7c8]/40 transition-all duration-300 hover:shadow-xl hover:border-[#181f21]/40 cursor-pointer flex flex-col justify-between text-left">
            <div>
              <div className="relative h-64 overflow-hidden bg-[#e8e8e8]">
                <img src={project.mainImage} alt={project.title} width={1400} height={934} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-white/95 text-[#181f21] font-montserrat font-bold text-xs uppercase px-4 py-2 rounded flex items-center gap-1.5 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5 text-[#0284c7]" /> Смотреть галерею
                  </span>
                </div>
                <div className="absolute top-3 left-3 bg-[#181f21]/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded">{project.categoryLabel}</div>
              </div>
              <div className="p-6">
                <h3 className="font-montserrat font-bold text-xl text-[#181f21] mb-2 group-hover:text-[#0284c7] transition-colors">{project.title}</h3>
                <p className="font-inter text-xs text-[#747879] flex items-center gap-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#0284c7]" /> {project.location}
                </p>
                <div className="flex justify-between items-center text-[#434749] font-inter text-sm pt-3 border-t border-[#E2E8F0]">
                  <span>Площадь: <strong>{project.area} м²</strong></span>
                  <span className="flex items-center gap-1 text-[#434749]">
                    <Clock className="w-3.5 h-3.5 text-[#10B981]" /> {project.duration}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
