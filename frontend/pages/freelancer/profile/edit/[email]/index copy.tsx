import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { countries } from "@/data/countries";
import { languages } from "@/data/languages";
import { skills } from "@/data/skill";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { selectUser } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

type SkillAndLanguage = { id: number; name: string; proficiency: string };

type FormData = {
  fullName: string;
  phone: string;
  bio: string;
  avatar?: string;
  country: string;
  languages: SkillAndLanguage[];
  skills: SkillAndLanguage[];
};

const availableSkillsData: Omit<SkillAndLanguage, "proficiency">[] = skills;
const availableLanguagesData: Omit<SkillAndLanguage, "proficiency">[] =
  languages;
const availableCountriesData = countries;

const formSchema = z.object({
  fullName: z.string().min(3, "Full Name must be at least 3 characters long"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number"),
  bio: z.string().min(10, "Bio must be at least 10 characters long"),
  country: z.string().min(1, "Country must be selected"),
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

export default function FreelancerEditForm() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      bio: "",
      avatar: "",
      country: "",
      languages: [],
      skills: [],
    },
    mode: "onSubmit",
  });

  const {
    fields: skillFields,
    append: addSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const {
    fields: languageFields,
    append: addLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
  });

  const [skillInput, setSkillInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedProficiency, setSelectedProficiency] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const freelancer = user?.freelancer;

  useEffect(() => {
    async function fetchFreelancerData() {
      const { email } = router.query;
      if (!email) return;

      try {
        const response = await axiosInstanceV1.get(
          `/freelancer/profile/${email}`,
        );

        const data = response.data;

        console.log(data);

        reset({
          fullName: data.fullName,
          phone: data.phone,
          bio: data.bio,
          avatar: data.avatar,
          country: data.country,
          languages: data.languages,
          //skills: data.skills,
        });
        debugger
        data.skills.forEach((skill: SkillAndLanguage) => {
          addSkill({
            id: skill.id,
            name: skill.name,
            proficiency: skill.proficiency,
          });
        });
      } catch (error) {
        console.error("Failed to fetch freelancer data:", error);
      }
    }

    fetchFreelancerData();
  }, [router.query, reset, freelancer]);

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillInput(value);

    if (value.trim()) {
      const filtered = availableSkillsData
        .map((s) => s.name)
        .filter(
          (skill) =>
            skill.toLowerCase().includes(value.toLowerCase()) &&
            !watch("skills").some((s: SkillAndLanguage) => s.name === skill),
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

    if (watch("skills").some((s: SkillAndLanguage) => s.name === skillInput))
      return;

    const selectedSkill = availableSkillsData.find(
      (_) => _.name === skillInput,
    );

    addSkill({
      id: selectedSkill?.id || Date.now(),
      name: skillInput,
      proficiency: selectedProficiency,
    });

    setSkillInput("");
    setSelectedProficiency("");
    setSuggestions([]);
  };

  const handleAddLanguage = (
    languageInput: string,
    selectedProficiency: string,
  ) => {
    if (!languageInput || !selectedProficiency) return;

    if (
      watch("languages").some((s: SkillAndLanguage) => s.name === languageInput)
    )
      return;

    const selectedLanguage = availableLanguagesData.find(
      (_) => _.name === languageInput,
    );

    addLanguage({
      id: selectedLanguage?.id || Date.now(),
      name: languageInput,
      proficiency: selectedProficiency,
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form Data Submitted:", values);

    try {
      const response = await fetch(`/api/freelancer/${router.query.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        router.push(`/freelancer/profile/${router.query.email}`);
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred. Please try again.");
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center bg-gray-100">
      <div className="items-center justify-center p-8 text-black">
        <h1 className="text-center text-3xl font-bold">Edit Profile</h1>
      </div>

      <div className="flex h-full w-full shadow-lg">
        <div className="w-full bg-white p-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-10 gap-6"
          >
            {/* Full Name */}
            <div className="col-span-3">
              <label className="text-gray-700">Full Name</label>
            </div>
            <div className="col-span-7">
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Full Name" required />
                )}
              />
              {errors.fullName && (
                <p className="text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="col-span-3">
              <label className="text-gray-700">Phone Number</label>
            </div>
            <div className="col-span-7">
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    placeholder="Phone Number"
                    required
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Bio */}
            <div className="col-span-3">
              <label className="text-gray-700">Bio</label>
            </div>
            <div className="col-span-7">
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-60"
                    placeholder="Tell us about yourself"
                    required
                  />
                )}
              />
              {errors.bio && (
                <p className="text-red-500">{errors.bio.message}</p>
              )}
            </div>

            {/* Country */}
            <div className="col-span-3">
              <label className="text-gray-700">Country</label>
            </div>
            <div className="col-span-7">
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <select {...field} className="w-full rounded-md border p-2">
                    <option value="">Select a country</option>
                    {availableCountriesData.map((country) => (
                      <option key={country.id} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.country && (
                <p className="text-red-500">{errors.country.message}</p>
              )}
            </div>

            {/* Skills */}
            <div className="col-span-3">
              <label className="text-gray-700">Skills</label>
            </div>
            <div className="col-span-7">
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={skillInput}
                  onChange={handleSkillInputChange}
                  type="text"
                  placeholder="Enter skill"
                  className="w-full rounded-md border p-2"
                />
                <select
                  value={selectedProficiency}
                  onChange={(e) => setSelectedProficiency(e.target.value)}
                  className="w-full rounded-md border p-2"
                >
                  <option value="">Select proficiency level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <Button type="button" onClick={handleAddSkill}>
                Add Skill
              </Button>
              {skillFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <p>
                    {field.name} ({field.proficiency})
                  </p>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeSkill(index)}
                  >
                    <X size={20} />
                  </Button>
                </div>
              ))}
              {errors.skills && (
                <p className="text-red-500">{errors.skills.message}</p>
              )}
            </div>

            {/* Languages */}
            <div className="col-span-3">
              <label className="text-gray-700">Languages</label>
            </div>
            <div className="col-span-7">
              <div className="grid grid-cols-2 gap-4">
                <select
                  id="language-select"
                  className="w-full rounded-md border p-2"
                >
                  <option value="">Select a language</option>
                  {availableLanguagesData.map((lang) => (
                    <option key={lang.id} value={lang.name}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <select
                  id="proficiency-select"
                  className="w-full rounded-md border p-2"
                >
                  <option value="">Select proficiency level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Fluent">Fluent</option>
                </select>
              </div>
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
                Add Language
              </Button>
              {languageFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <p>
                    {field.name} ({field.proficiency})
                  </p>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeLanguage(index)}
                  >
                    <X size={20} />
                  </Button>
                </div>
              ))}
              {errors.languages && (
                <p className="text-red-500">{errors.languages.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="col-span-10 flex justify-center">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
