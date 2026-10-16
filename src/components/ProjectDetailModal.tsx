import React, { useState } from 'react';
import { ProjectItem } from '../types';
import { X, MapPin, Clock, Check, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onRequestQuote: (projectTitle: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onRequestQuote,
}) => {
  if (!project) return null;

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const galleryList = project.gallery && project.gallery.length > 0 ? project.gallery : [project.mainImage];

  const handleNextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % galleryList.length);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + galleryList.length) % galleryList.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-[#E2E8F0]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-[#181f21] p-2 rounded-full shadow-md transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative h-72 sm:h-96 md:h-[420px] bg-black">
          <img
            src={galleryList[activePhotoIdx]}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {galleryList.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 px-3 py-1 rounded-full">
                {galleryList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      activePhotoIdx === idx ? 'bg-[#0284c7] w-4' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute top-4 left-4 bg-[#181f21] text-white text-xs font-bold px-3 py-1 rounded">
            {project.categoryLabel}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#E2E8F0] pb-6">
            <div>
              <h2 className="font-montserrat font-bold text-2xl sm:text-3xl text-[#181f21] mb-1">
                {project.title}
              </h2>
              <p className="font-inter text-sm text-[#747879] flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#0284c7]" /> {project.location}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-[#f3f3f4] p-3 rounded border border-[#E2E8F0]">
              <div>
                <p className="text-[11px] uppercase text-[#747879] font-bold">Площадь</p>
                <p className="font-montserrat font-bold text-base text-[#181f21]">{project.area} м²</p>
              </div>
              <div className="h-8 w-[1px] bg-gray-300" />
              <div>
                <p className="text-[11px] uppercase text-[#747879] font-bold">Срок</p>
                <p className="font-montserrat font-bold text-base text-[#181f21]">{project.duration}</p>
              </div>
              <div className="h-8 w-[1px] bg-gray-300" />
              <div>
                <p className="text-[11px] uppercase text-[#747879] font-bold">Смета</p>
                <p className="font-montserrat font-bold text-base text-[#0284c7]">{project.cost}</p>
              </div>
            </div>
          </div>

          <p className="font-inter text-base text-[#434749] leading-relaxed mb-6">
            {project.description}
          </p>

          <div className="mb-8">
            <h3 className="font-montserrat font-bold text-sm text-[#181f21] uppercase tracking-wider mb-3">
              Особенности проекта:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.highlights.map((h, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-[#f9f9f9] p-3 rounded border border-[#E2E8F0] text-sm text-[#434749]">
                  <Check className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#E2E8F0]">
            <button
              onClick={() => {
                const title = project.title;
                onClose();
                onRequestQuote(`Хочу ремонт как в проекте "${title}"`);
              }}
              className="flex-1 bg-[#0284c7] hover:bg-[#0369a1] text-white font-montserrat font-bold text-sm uppercase py-4 rounded flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Хочу такой же ремонт</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 border border-[#747879]/40 text-[#181f21] font-montserrat font-bold text-sm uppercase rounded hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
