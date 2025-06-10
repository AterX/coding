"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlogPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Our Blog
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover our latest thoughts, ideas, and insights
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with Web Development</CardTitle>
              <CardDescription>Published on January 15, 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Learn the fundamentals of web development and start your journey as a developer.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best Practices for Modern Web Design</CardTitle>
              <CardDescription>Published on January 10, 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Explore the latest trends and best practices in modern web design.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Understanding React Hooks</CardTitle>
              <CardDescription>Published on January 5, 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                A comprehensive guide to understanding and using React Hooks effectively.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}