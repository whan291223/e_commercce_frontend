import React, { useState } from 'react';
import { Heart, Star, Film, Sparkles, Camera, Music, Palette, Book } from 'lucide-react';

export default function ActorProfile() {
  const [activeProfile, setActiveProfile] = useState(0);

  const profiles = [
    {
      name: "Emma Chen",
      age: 22,
      location: "Los Angeles, CA",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      color: "from-pink-400 to-rose-400",
      bgColor: "bg-pink-50",
      thingsILove: [
        { icon: Camera, activity: "Photography", description: "Capturing golden hour moments and street portraits" },
        { icon: Music, activity: "Playing Guitar", description: "Indie folk songs are my favorite to play" },
        { icon: Book, activity: "Reading Scripts", description: "Always studying character development and dialogue" }
      ],
      favoriteGenres: ["Romance", "Drama", "Sci-Fi"],
      pastProjects: [
        { title: "Summer Dreams", role: "Lead Actress", year: "2024", description: "Independent romantic drama filmed in coastal California" },
        { title: "Coffee Shop Chronicles", role: "Supporting Role", year: "2023", description: "Web series about baristas and their daily lives" },
        { title: "The Last Letter", role: "Lead Actress", year: "2023", description: "Short film that won Best Actress at Indie Film Festival" }
      ],
      bio: "Aspiring actress who believes every great story starts with passion ✨"
    },
    {
      name: "Sophia Martinez",
      age: 24,
      location: "New York, NY",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      color: "from-purple-400 to-indigo-400",
      bgColor: "bg-purple-50",
      thingsILove: [
        { icon: Palette, activity: "Painting", description: "Abstract art and watercolor landscapes" },
        { icon: Film, activity: "Film Editing", description: "Creating magic in post-production" },
        { icon: Music, activity: "Dancing", description: "Contemporary and jazz dance styles" }
      ],
      favoriteGenres: ["Action", "Comedy", "Thriller"],
      pastProjects: [
        { title: "City Lights", role: "Lead Actress", year: "2024", description: "Urban thriller set in Manhattan's underground scene" },
        { title: "Broadway Dreams", role: "Ensemble Cast", year: "2023", description: "Musical theater production off-Broadway" },
        { title: "Shadows & Secrets", role: "Supporting Role", year: "2022", description: "Mystery series that aired on streaming platform" }
      ],
      bio: "Actress, artist, and storyteller bringing characters to life 🎬💜"
    }
  ];

  const currentProfile = profiles[activeProfile];

  return (
    <div className={`min-h-screen ${currentProfile.bgColor} p-6`}>
      <div className="max-w-2xl mx-auto">
        {/* Profile Switcher */}
        <div className="flex gap-4 mb-6">
          {profiles.map((profile, index) => (
            <button
              key={index}
              onClick={() => setActiveProfile(index)}
              className={`flex-1 p-4 rounded-2xl transition-all ${
                activeProfile === index
                  ? `bg-linear-to-r ${profile.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-600 hover:shadow-md'
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden border-2 border-white">
                <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <div className="font-semibold text-sm">{profile.name}</div>
            </button>
          ))}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header with Photo */}
          <div className={`bg-linear-to-r ${currentProfile.color} p-8 text-white text-center relative overflow-hidden`}>
            <div className="absolute top-0 right-0 opacity-20">
              <Sparkles size={120} />
            </div>
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10">
              <img src={currentProfile.photo} alt={currentProfile.name} className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold mb-2 relative z-10">{currentProfile.name}</h1>
            <p className="text-white/90 mb-1 relative z-10">{currentProfile.age} years old</p>
            <p className="text-white/80 text-sm relative z-10">{currentProfile.location}</p>
          </div>

          {/* Bio */}
          <div className="p-6 border-b border-gray-100">
            <p className="text-gray-700 text-center italic">{currentProfile.bio}</p>
          </div>

          {/* Things I Love to Do */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className={`text-${activeProfile === 0 ? 'pink' : 'purple'}-500`} fill="currentColor" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Things I Love to Do</h2>
            </div>
            <div className="space-y-3">
              {currentProfile.thingsILove.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="bg-linear-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-linear-to-r ${currentProfile.color}`}>
                        <IconComponent className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.activity}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Favorite Genres */}
          <div className="p-6 bg-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <Film className="text-indigo-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Favorite Genres</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentProfile.favoriteGenres.map((genre, index) => (
                <span
                  key={index}
                  className={`px-4 py-2 bg-linear-to-r ${currentProfile.color} text-white rounded-full text-sm font-medium`}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Past Projects */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-yellow-500" fill="currentColor" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Past Projects</h2>
            </div>
            <div className="space-y-4">
              {currentProfile.pastProjects.map((project, index) => (
                <div key={index} className="bg-linear-to-r from-white to-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 text-lg">{project.title}</h3>
                    <span className={`px-3 py-1 bg-linear-to-r ${currentProfile.color} text-white rounded-full text-xs font-medium`}>
                      {project.year}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">🎬 {project.role}</p>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="text-center mt-6 text-gray-500 text-sm">
          <p>✨ Lights, Camera, Action! ✨</p>
        </div> */}
      </div>
    </div>
  );
}