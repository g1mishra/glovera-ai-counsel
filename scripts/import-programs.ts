import { parse } from "csv-parse";
import fs from "fs";
import path from "path";

function validateAndTransformData(data: any) {
  const requiredFields = [
    "course_name",
    "degree_type",
    "tuition_fee",
    "duration",
    "university_name",
    "university_location",
    "start_date",
    "apply_date",
  ];

  const missingFields = requiredFields.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  let english_requirements = data.english_requirments
    ? JSON.parse(data.english_requirments)
    : null;

  english_requirements = Object.keys(english_requirements).reduce(
    (acc, key) => {
      if (english_requirements[key]) {
        // @ts-ignore
        acc[key] = String(english_requirements[key]);
      }
      return acc;
    },
    {}
  );
  return {
    course_name: data.course_name,
    degree_type: data.degree_type,
    tuition_fee: data.tuition_fee,
    duration: data.duration,
    university_name: data.university_name,
    university_location: data.university_location,
    global_rank: data.global_rank || null,
    program_url: data.program_url || null,
    intake_date: data.start_date,
    application_deadline: data.apply_date,
    english_requirements: english_requirements,
    min_gpa: data.min_gpa || null,
    work_experience: data.work_experience || null,
  };
}

export async function importPrograms(filePath: string) {
  const programs: any[] = [];
  const errors: any[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(path.resolve(filePath))
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on("data", (data: any) => {
        try {
          const transformedData = validateAndTransformData(data);
          programs.push(transformedData);
        } catch (error: any) {
          console.error("Validation error:", error?.message);
          errors.push({ data, error: error?.message });
        }
      })
      .on("end", async () => {
        try {
          if (errors.length > 0) {
            console.error("Validation errors:", errors);
            reject(errors);
            return;
          }

          if (programs.length === 0) {
            console.warn("No valid data to import.");
            resolve();
            return;
          }

          // const response = await fetch(
          //   "http://localhost:3000/api/programs/import",
          //   {
          //     method: "POST",
          //     headers: { "Content-Type": "application/json" },
          //     body: JSON.stringify(programs),
          //   }
          // );

          // if (!response.ok) {
          //   const result = await response.json();
          //   console.error("API error:", result);
          //   reject(result);
          //   return;
          // }

          // const result = await response.json();
          // console.log(
          //   `Successfully imported ${
          //     result.imported || programs.length
          //   } programs!`
          // );

          console.log(`Successfully imported ${programs.length} programs!`);
          console.log(programs[0]);
          resolve();
        } catch (error: any) {
          console.error("API upload error:", error.message);
          reject(error);
        }
      })
      .on("error", (error: any) => {
        console.error("File read error:", error.message);
        reject(error);
      });
  });
}
