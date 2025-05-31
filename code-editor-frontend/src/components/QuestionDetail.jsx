export default function QuestionDetail({ question }) {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-indigo-900">
        {question.title}
      </h1>
      <p className="mb-6 whitespace-pre-wrap">{question.description}</p>
      <div>
        <h2 className="font-semibold mb-2 text-indigo-700">Company Tags:</h2>
        {question.companyTags?.length ? (
          <ul className="flex flex-wrap gap-2">
            {question.companyTags.map((tag) => (
              <li
                key={tag}
                className="bg-indigo-200 text-indigo-800 rounded-full px-3 py-1 font-semibold text-sm"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tags</p>
        )}
      </div>
    </>
  );
}
