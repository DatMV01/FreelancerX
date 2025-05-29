import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import UploadFile from "@/components/uploadfile/UploadFile";
import { countries } from "@/data/countries";
import { languages } from "@/data/languages";
import { skills } from "@/data/skill";
import { DashboardMainContentHeader } from "@/features/dashboard/components/DashboardMainContent";
import {
  selectUser,
  signUpAsFreelancer,
} from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@mui/material";
import clsx from "clsx";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

type SkillAndLanguage = { id: number; name: string; proficiency: string };

type FormData = {
  displayName: string;
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
  displayName: z
    .string()
    .min(3, "Display name must be at least 3 characters long"),
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

export default function FreelancerSignupForm() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
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

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [skillInput, setSkillInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedProficiency, setSelectedProficiency] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "errror";
    message: string;
  }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, update } = useSession();
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

    // Check existed skill
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

  const handleAddLaguage = (
    languageInput: string,
    selectedProficiency: string,
  ) => {
    if (!languageInput || !selectedProficiency) return;

    // Check existed skill
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("avatar", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setValue("avatar", "");
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form Data Submitted:", values);

    try {
      const data = await dispatch(signUpAsFreelancer(values)).unwrap();

      await update({
        isUpdate: true,
      });

      setMessage({
        type: "success",
        message: "Sign up as a Freelancer successfully !",
      });

      setCountdown(5);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            router.push(`/freelancer/profile/${data.email}`);
            return null;
          }
          return prev! - 1;
        });
      }, 1000);
    } catch (err) {
      setMessage({
        type: "errror",
        message: "An error occurred. Please try again.",
      });
    }

    // try {
    //   const response = await axiosInstanceV1.post("/freelancer", values);

    //   const { data, status } = response;

    //   if (status === 201) {
    //     setMessage({
    //       type: "success",
    //       message: "Sign Up as a Freelancer successfully !",
    //     });

    //     setCountdown(5);

    //     const countdownInterval = setInterval(() => {
    //       setCountdown((prev) => {
    //         if (prev === 1) {
    //           clearInterval(countdownInterval);
    //           router.push(`/freelancer/profile/${data.email}`);
    //           return null;
    //         }
    //         return prev! - 1;
    //       });
    //     }, 1000);
    //   }

    //   
    //   console.log("Form Data Submitted Successfully:", response.data);
    // } catch (error) {
    //   setMessage({
    //     type: "errror",
    //     message: "An error occurred. Please try again.",
    //   });
    // }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div
        className={clsx(
          "flex w-full flex-col items-center justify-center gap-x-2",
          "flex items-center justify-center gap-x-2 border border-green-500 p-2",
          "rounded-md text-center text-2xl font-bold text-green-500",
        )}
      >
        <p className="text-center text-3xl font-bold">
          Sign up as a Freelancer
        </p>
        <p className="mt-4 text-center text-sm text-gray-600">
          Join our platform and start earning today.
        </p>
      </div>

      <div className="flex h-full w-full shadow-lg">
        <div className="w-full bg-white p-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-10 gap-6"
          >
            {/* Display Name */}
            <div className="col-span-3">
              <label className="text-gray-700">Display Name</label>
            </div>
            <div className="col-span-7">
              <Controller
                name="displayName"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Display Name" required />
                )}
              />
              {errors.displayName && (
                <p className="text-red-500">{errors.displayName.message}</p>
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

            {/* Avatar Upload Section */}
            <div className="col-span-3">
              <label className="text-gray-700">Profile Picture</label>
            </div>
            <div className="col-span-7">
              <UploadFile
                className="h-40 w-40"
                fileType="image"
                addionalFileType="avartar"
                onUploadSuccessCb={(e: any) => {
                  setValue("avatar", e.data.url);
                }}
                autoUpload
              />
              {false && (
                <>
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
                        {watch("avatar") ? (
                          <img
                            src={watch("avatar")}
                            alt="Avatar Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-gray-500">
                            Upload
                          </span>
                        )}
                      </label>

                      {watch("avatar") && isHovered && (
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
                </>
              )}
            </div>

            {/* Country Section */}
            <div className="col-span-3">
              <label className="text-gray-700">Country</label>
            </div>
            <div className="col-span-7">
              <div className="grid gap-4">
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => {
                        setValue("country", e.target.value);
                      }}
                      className="w-full rounded border p-2"
                    >
                      <option value="">Select a country</option>
                      {availableCountriesData.map((lang) => (
                        <option key={lang.id} value={lang.name}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
              {errors.country && (
                <p className="text-red-500">{errors.country.message}</p>
              )}
            </div>

            {/* Languages Section */}
            <div className="col-span-3">
              <label className="text-gray-700">Languages</label>
            </div>
            <div className="col-span-7">
              {/* Add Language Select */}
              <div className="grid grid-cols-2 gap-4">
                <select
                  id="language-select"
                  className="w-full rounded-md border border-gray-300 p-2"
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
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select proficiency level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Fluent">Fluent</option>
                </select>
              </div>

              <div className="flex justify-end py-4">
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

                    handleAddLaguage(lang, prof);
                  }}
                >
                  Add Language
                </Button>
              </div>

              {/* Render Languages */}
              <div className="flex flex-wrap gap-2">
                {languageFields.map((field, index) => (
                  <Badge
                    key={field.id}
                    className="flex items-center justify-center space-x-2 rounded-full bg-gray-300 p-2 font-semibold"
                  >
                    <span>
                      {field.name} - {field.proficiency}
                    </span>
                    <Button
                      className="m-0 h-6 w-6 p-0 hover:bg-red-800"
                      type="button"
                      variant="destructive"
                      onClick={() => removeLanguage(index)}
                    >
                      <X size={20} />
                    </Button>
                  </Badge>
                ))}
              </div>
              {errors.languages && (
                <p className="text-red-500">{errors.languages.message}</p>
              )}
            </div>

            {/* Skills Section */}
            <div className="col-span-3">
              <label className="text-gray-700">Skills</label>
            </div>
            <div className="col-span-7">
              {/* Skill Input */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={skillInput}
                  onChange={handleSkillInputChange}
                  type="text"
                  placeholder="Enter skill"
                  className="w-full rounded-md border border-gray-300 p-2"
                />

                <select
                  value={selectedProficiency}
                  onChange={(e) => setSelectedProficiency(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select proficiency level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Suggestion List */}
              {suggestions.length > 0 && (
                <ul className="mt-2 rounded-md border bg-white shadow-lg">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex justify-end py-4">
                <Button type="button" onClick={handleAddSkill}>
                  Add Skill
                </Button>
              </div>

              {/* Render Skills */}
              <div className="flex flex-wrap gap-2">
                {skillFields.map((skill, index) => (
                  <Badge
                    key={skill.id}
                    className="flex items-center justify-center space-x-2 rounded-full bg-gray-300 p-2 font-semibold"
                  >
                    <span>
                      {skill.name} - {skill.proficiency}
                    </span>
                    <Button
                      className="m-0 h-6 w-6 p-0 hover:bg-red-800"
                      type="button"
                      variant="destructive"
                      onClick={() => removeSkill(index)}
                    >
                      <X size={20} />
                    </Button>
                  </Badge>
                ))}
              </div>

              {errors.skills && (
                <p className="text-red-500">{errors.skills.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="col-span-10 flex justify-center">
              {/* ✅ Submit Button */}
              <Button
                type="submit"
                className="rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Submit Request"}
              </Button>
            </div>
          </form>

          {/* ✅ Success & Error Messages */}
          {message && (
            <p
              className={`mt-2 text-center text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}
            >
              {message.message}
            </p>
          )}

          {/* Hiển thị thời gian đếm ngược nếu có */}
          {countdown !== null && (
            <p className="text-center text-sm text-gray-600">
              Redirecting in {countdown} seconds...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
