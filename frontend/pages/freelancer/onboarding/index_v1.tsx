import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { languages } from "@/data/languages";
import { skills } from "@/data/skill";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import { z } from "zod";

type SkillAndLanguage = { id: number; name: string; proficiency: string };

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  avatar?: string;
  languages: SkillAndLanguage[];
  skills: SkillAndLanguage[];
};

const availableSkillsData: Omit<SkillAndLanguage, "proficiency">[] = skills;
const availableLanguagesData: Omit<SkillAndLanguage, "proficiency">[] =
  languages;

const formSchema = z.object({
  fullName: z.string().min(3, "Full Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number"),
  bio: z.string().min(10, "Bio must be at least 10 characters long"),
  avatar: z.string().optional(),
  skills: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        proficiency: z.string(),
      }),
    )
    .min(1, "At least one skill must be selected"),
  languages: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        proficiency: z.string(),
      }),
    )
    .min(1, "At least one language must be selected"),
});

export default function FreelancerSignupForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    avatar: "",
    languages: [],
    skills: [],
  });

  const [errors, setErrors] = useState<any>({});
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name } = e.target;
    const value = e.target.value.trim();
    if (name === "skills") {
      setFormData((prev) => ({
        ...prev,
        skills: Array.from(
          new Set([
            ...prev.skills,
            { id: Date.now(), name: value, proficiency: "Beginner" },
          ]),
        ),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLanguage = (name: string, proficiency: string) => {
    if (!name || !proficiency) return;

    setFormData((prev) => {
      if (prev.languages.some((lang) => lang.name === name)) return prev;

      return {
        ...prev,
        languages: [...prev.languages, { id: Date.now(), name, proficiency }], // Thêm id
      };
    });
  };

  const handleRemoveLanguage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const handleAddSkill2 = (name: string, proficiency: string) => {
    if (!name || !proficiency) return;

    setFormData((prev) => {
      if (prev.skills.some((skill) => skill.name === name)) return prev;

      return {
        ...prev,
        skills: [...prev.skills, { id: Date.now(), name, proficiency }], // Thêm id
      };
    });
  };

  const handleRemoveSkill = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }));
  };

  const removeAvatar = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, avatar: "" }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
    } else {
      setErrors({});
      console.log("Form Data Submitted:", formData); // Chỗ xử lý dữ liệu form hợp lệ
    }
  };

  const [skillInput, setSkillInput] = useState(""); // Input skill
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedProficiency, setSelectedProficiency] = useState("");

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillInput(value);

    if (value.trim()) {
      const filtered = availableSkillsData
        .map((s) => s.name)
        .filter(
          (skill) =>
            skill.toLowerCase().includes(value.toLowerCase()) &&
            !formData.skills.some((s) => s.name === skill),
        );

      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (skill: string) => {
    setSkillInput(skill);
    setSuggestions([]);
  };

  const handleAddSkill = () => {
    if (!skillInput || !selectedProficiency) return;

    // Check existed skill
    if (formData.skills.some((s) => s.name === skillInput)) return;

    setFormData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        { id: Date.now(), name: skillInput, proficiency: selectedProficiency },
      ],
    }));

    // Reset input
    setSkillInput("");
    setSelectedProficiency("");
    setSuggestions([]);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center bg-gray-100">
      <div className="items-center justify-center p-8 text-black">
        <h1 className="text-center text-3xl font-bold">
          Sign Up as a Freelancer
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Join our platform and start earning today.
        </p>
      </div>

      <div className="flex h-full w-full shadow-lg">
        <div className="w-full bg-white p-12">
          <form onSubmit={handleSubmit} className="grid grid-cols-10 gap-6">
            {/* Cột trái (Label) */}
            <div className="col-span-3">
              <label className="text-gray-700">Full Name</label>
            </div>
            {/* Cột phải (Input) */}
            <div className="col-span-7">
              <Input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              {errors.fullName && (
                <p className="text-red-500">{errors.fullName._errors[0]}</p>
              )}
            </div>
            {/* Email */}
            {false && (
              <>
                <div className="col-span-3">
                  <label className="text-gray-700">Email</label>
                </div>
                <div className="col-span-7">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email._errors[0]}</p>
                  )}
                </div>
              </>
            )}
            {/* Phone Number */}
            <div className="col-span-3">
              <label className="text-gray-700">Phone Number</label>
            </div>
            <div className="col-span-7">
              <Input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && (
                <p className="text-red-500">{errors.phone._errors[0]}</p>
              )}
            </div>
            {/* Bio */}
            <div className="col-span-3">
              <label className="text-gray-700">Bio</label>
            </div>
            <div className="col-span-7">
              <Textarea
                name="bio"
                className="h-60"
                placeholder="Tell us about yourself"
                value={formData.bio}
                onChange={handleChange}
                required
              />
              {errors.bio && (
                <p className="text-red-500">{errors.bio._errors[0]}</p>
              )}
            </div>
            {/* Avatar Upload Section */}
            <div className="col-span-3">
              <label className="text-gray-700">Profile Picture</label>
            </div>
            <div className="col-span-7">
              <div className="flex items-center space-x-4">
                <div
                  className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-gray-300"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 cursor-pointer"
                  >
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Avatar Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-gray-500">
                        Upload
                      </span>
                    )}
                  </label>

                  {formData.avatar && isHovered && (
                    <button
                      onClick={removeAvatar}
                      className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-full bg-black"
                    >
                      <X size={24} className="text-white" />
                    </button>
                  )}
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
            {/* Languages & Proficiency */}
            <div className="col-span-3">
              <label className="text-gray-700">Languages</label>
            </div>
            <div className="col-span-7 grid grid-cols-2 gap-4">
              {/* Language Select */}
              <div className="flex flex-col">
                <select
                  id="language-select"
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select a language</option>
                  {availableLanguagesData.map((_) => (
                    <option key={_.id} value={_.name}>
                      {_.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Proficiency Select */}
              <div className="flex flex-col">
                <select
                  id="proficiency-select"
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select proficiency level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Fluent">Fluent</option>
                </select>
              </div>

              {/* Add Button */}
              <div className="col-span-2 flex justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    const lang = (
                      document.getElementById(
                        "language-select",
                      ) as HTMLSelectElement
                    ).value;
                    const prof = (
                      document.getElementById(
                        "proficiency-select",
                      ) as HTMLSelectElement
                    ).value;
                    handleAddLanguage(lang, prof);
                  }}
                >
                  Add Lanuage
                </Button>
              </div>
              {errors.languages && (
                <p className="text-red-500">{errors.languages._errors[0]}</p>
              )}
            </div>

            {/* Display added languages */}
            <div className="col-span-3"></div>
            <div className="col-span-7">
              {formData.languages.map((lang, index) => (
                <div
                  key={index}
                  className="mt-2 flex items-center justify-between rounded-md bg-gray-200 p-2"
                >
                  <span>
                    {lang.name} - {lang.proficiency}
                  </span>
                  <button
                    onClick={() => handleRemoveLanguage(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Display Input Skills */}
            <div className="col-span-3">
              <label className="text-gray-700">Skills</label>
            </div>

            <div className="col-span-7 grid grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter or select a skill"
                  value={skillInput}
                  onChange={handleSkillInputChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                />

                {suggestions.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="cursor-pointer px-3 py-2 hover:bg-gray-200"
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col">
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={selectedProficiency}
                  onChange={(e) => setSelectedProficiency(e.target.value)}
                >
                  <option value="">Select proficiency level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="col-span-2 flex justify-end">
                <Button type="button" onClick={handleAddSkill}>
                  Add Skill
                </Button>
              </div>
            </div>

            {/* Display added Skills */}
            <div className="col-span-3">
              <label className="text-gray-700"> </label>
            </div>
            <div className="col-span-7">
              {errors.skills && (
                <p className="text-red-500">{errors.skills._errors[0]}</p>
              )}

              {formData.skills.map((lang, index) => (
                <div
                  key={index}
                  className="mt-2 flex items-center justify-between rounded-md bg-gray-200 p-2"
                >
                  <span>
                    {lang.name} - {lang.proficiency}
                  </span>
                  <button
                    onClick={() => handleRemoveSkill(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="col-span-10 flex justify-end">
              <Button type="submit" className="w-1/3">
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
