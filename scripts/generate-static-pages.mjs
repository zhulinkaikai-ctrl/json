import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const SITE_URL = 'https://jsonfmt.org'
export const SITE_NAME = 'JSONFmt'
export const CONTACT_EMAIL = 'zhulinkaikai@gmail.com'
const CLOUDFLARE_WEB_ANALYTICS_TOKEN = '1247ce6193f744b0b365cd24ef117245'

const today = '2026-08-11'

export const GUIDE_PAGES = [
  guide({
    slug: 'trailing-comma-in-json',
    title: 'Trailing Comma in JSON: Why It Fails and How to Fix It',
    description: 'Learn why trailing commas break strict JSON, how to spot them, and how to fix the error before formatting or validating your data.',
    summary: 'A trailing comma is one of the fastest ways to turn valid-looking JavaScript-style data into invalid JSON.',
    primaryKeyword: 'trailing comma in JSON',
    invalidCode: `{
  "name": "Ada",
  "role": "Engineer",
}`,
    fixedCode: `{
  "name": "Ada",
  "role": "Engineer"
}`,
    sections: [
      section('What the error means', [
        'A trailing comma in JSON is a comma that appears after the final property in an object or after the final value in an array. JavaScript allows this style in many places, so developers often paste a JavaScript object literal into a JSON validator and expect it to work. Strict JSON is different. The JSON grammar requires commas only between values, never after the last value.',
        'This article is for developers who already know what the data should look like but need to make it valid JSON quickly. The fix is usually simple: remove the comma that sits immediately before a closing brace or closing bracket.',
      ]),
      section('Why strict JSON rejects it', [
        'JSON is commonly exchanged between services, stored in configuration files, and parsed by tools in many languages. Its strict grammar is one reason it is portable. A parser written in Go, Python, Java, Rust, PHP, or a browser should not have to guess whether the final comma means another value is coming. When the parser sees a comma, it expects another property or array item. If the next character is `}` or `]`, the syntax is invalid.',
        'This is why a trailing comma often produces messages like "Unexpected token }" or "Expected property name". The highlighted location may be the closing brace, but the actual mistake is usually the comma immediately before it.',
      ]),
      section('How to fix it safely', [
        'Scan the line above the highlighted closing brace or bracket. If the last item ends with a comma, delete that comma and validate again. Do not remove commas between real values. In an object, every property except the last one needs a comma after it. In an array, every item except the last item needs a comma after it.',
        'When you use JSONFmt, paste the JSON into the editor and look at the diagnostic panel. If the error is classified as a trailing comma, the panel points to the comma and explains that strict JSON does not allow it after the final item. The tool does not auto-repair your input, so you stay in control of the data.',
      ]),
      section('Common places trailing commas appear', [
        'Trailing commas often come from hand-edited configuration files, copied JavaScript objects, and test fixtures. They also appear when a developer deletes the final property but forgets to remove the comma from the previous line. Arrays have the same problem: `["read", "write",]` is not valid JSON even though it looks harmless.',
        'A good habit is to format valid JSON after each manual edit. If formatting is disabled, the document is still invalid. Fix the syntax first, then format or minify it.',
      ]),
    ],
    faq: [
      ['Are trailing commas valid in JSON?', 'No. Strict JSON does not allow a comma after the final object property or array item.'],
      ['Why does JavaScript allow trailing commas but JSON does not?', 'JavaScript object literals and JSON use similar syntax, but JSON is a stricter data format with a separate grammar.'],
      ['Can a formatter remove trailing commas automatically?', 'Some repair tools can, but JSONFmt V2 shows the problem and lets you decide how to edit the data.'],
    ],
  }),
  guide({
    slug: 'unexpected-token-in-json',
    title: 'Unexpected Token in JSON: How to Read and Fix the Error',
    description: 'Understand common unexpected token JSON parse errors, where to look first, and how to repair invalid JSON without guessing.',
    summary: 'Unexpected token errors are parser clues. The token is where parsing failed, not always where the original mistake started.',
    primaryKeyword: 'unexpected token in JSON',
    invalidCode: `{
  "name": "Ada"
  "role": "Engineer"
}`,
    fixedCode: `{
  "name": "Ada",
  "role": "Engineer"
}`,
    sections: [
      section('What "unexpected token" means', [
        'An unexpected token error means the JSON parser reached a character that cannot legally appear at that position. The token might be a quote, brace, bracket, comma, letter, or the end of the input. The important detail is position: the parser is telling you where its expectations stopped matching the text.',
        'This article is for developers debugging copied API responses, log payloads, or configuration data. Instead of guessing, start at the reported line and column, then inspect the line immediately before it. Many unexpected token errors are caused by a missing comma, an extra comma, a missing quote, or a bracket that closes too early.',
      ]),
      section('The token is often only the symptom', [
        'If the parser highlights a property name, the actual mistake may be the previous line. For example, an object property must be separated from the next property by a comma. If the comma is missing after `"name": "Ada"`, the next quote before `"role"` becomes unexpected. The quote is not wrong by itself; it is wrong because the previous value was not closed with a separator.',
        'This is why JSON diagnostics should explain the surrounding context, not only repeat the native parser message. JSONFmt tries to classify common patterns such as missing comma, trailing comma, unquoted key, and bracket mismatch before falling back to a generic syntax error.',
      ]),
      section('How to troubleshoot it', [
        'First, go to the reported line and column. Second, check the character at that location. Third, check the previous meaningful character before it. If two quoted values or two properties appear back to back, add a comma between them. If a closing brace appears right after a comma, remove the comma. If a word appears where a quoted key should be, wrap the key in double quotes.',
        'Avoid large blind edits. Make one syntax change, then validate again. This is especially important with API payloads because one wrong replacement can change the shape of the data.',
      ]),
      section('Prevention tips', [
        'Use strict JSON for files that will be parsed outside JavaScript. Avoid comments, single quotes, and JavaScript-only conveniences. Keep generated JSON generated whenever possible. If you need to hand-edit a payload, paste it into a validator before committing it to a repository or sending it to another service.',
        'When the JSON becomes valid, format it. A formatted document makes the next syntax issue easier to spot because indentation exposes object and array boundaries.',
      ]),
    ],
    faq: [
      ['What is an unexpected token in JSON?', 'It is a character the parser did not expect at that location according to strict JSON syntax.'],
      ['Is the highlighted token always the real mistake?', 'Not always. It is where parsing failed. The real mistake is often just before that position.'],
      ['How do I fix unexpected token errors quickly?', 'Check the highlighted line, then the previous line, for missing commas, extra commas, missing quotes, or mismatched braces.'],
    ],
  }),
  guide({
    slug: 'single-quotes-in-json',
    title: 'Single Quotes in JSON: Why They Are Invalid',
    description: 'JSON strings and property names must use double quotes. See invalid and fixed examples for single-quote JSON errors.',
    summary: 'Single quotes are common in JavaScript, Python, and examples online, but strict JSON requires double quotes.',
    primaryKeyword: 'single quotes in JSON',
    invalidCode: `{
  'name': 'Ada',
  'role': 'Engineer'
}`,
    fixedCode: `{
  "name": "Ada",
  "role": "Engineer"
}`,
    sections: [
      section('The short answer', [
        'Single quotes are not valid string delimiters in standard JSON. Property names and string values must be wrapped in double quotes. If you paste `{\'name\': \'Ada\'}` into a strict JSON parser, it fails even though a JavaScript console may accept something similar as an object literal.',
        'This article is for developers who copied data from JavaScript, Python, documentation, or a log and need to turn it into valid JSON. The fix is to replace single quotes around keys and string values with double quotes, while preserving apostrophes inside string values by escaping them only when needed.',
      ]),
      section('JSON is not a JavaScript object literal', [
        'JSON syntax was inspired by JavaScript object notation, but it is a data-interchange format with tighter rules. JavaScript allows object literals with single-quoted strings. JSON does not. The restriction makes parsing simpler and more consistent across programming languages.',
        'A common mistake is to assume that anything accepted by JavaScript is valid JSON. It is not. JSON also rejects comments, functions, undefined, trailing commas, and unquoted property names.',
      ]),
      section('How to fix single-quote errors', [
        'Replace the opening and closing single quote for each JSON key or string value with a double quote. Be careful with apostrophes inside values. For example, `"owner": "Ada API"` is valid because the string uses double quotes around the value. If the value itself contains a double quote, escape it with a backslash.',
        'Do not run a naive find-and-replace on complex data if values contain contractions or apostrophes. Validate after each change or use a trusted conversion step that understands string boundaries.',
      ]),
      section('What JSONFmt reports', [
        'When JSONFmt detects a single quote outside a valid string, it classifies the error as a single-quote issue. The diagnostic panel explains that strict JSON strings must use double quotes and gives a direct repair instruction. The tool does not send your JSON to a server and does not rewrite the input automatically.',
        'After you replace the quotes and the JSON becomes valid, the Format and Minify actions become available. That gives you a second check that the document is truly parseable strict JSON.',
      ]),
    ],
    faq: [
      ['Can JSON use single quotes?', 'No. JSON keys and string values must use double quotes.'],
      ['Why does my browser console accept single quotes?', 'The console may be evaluating a JavaScript object literal, not strict JSON.'],
      ['Should I replace every single quote?', 'Only replace single quotes that delimit JSON keys or string values. Apostrophes inside double-quoted strings can remain.'],
    ],
  }),
  guide({
    slug: 'unquoted-property-name-in-json',
    title: 'Unquoted Property Name in JSON: The Correct Fix',
    description: 'Strict JSON requires object property names to be double-quoted. Learn how to fix unquoted keys safely.',
    summary: 'An unquoted property name is valid in many JavaScript object literals, but it is not valid JSON.',
    primaryKeyword: 'unquoted property name in JSON',
    invalidCode: `{
  name: "Ada",
  role: "Engineer"
}`,
    fixedCode: `{
  "name": "Ada",
  "role": "Engineer"
}`,
    sections: [
      section('What the error means', [
        'An unquoted property name means an object key appears as a bare word instead of a double-quoted string. In JSON, every object key must be a string. That means `name: "Ada"` is invalid, while `"name": "Ada"` is valid.',
        'This article is for developers who copied a JavaScript-style object into a JSON tool or API client. The data may look reasonable, but strict JSON parsers reject it because object keys must be quoted consistently.',
      ]),
      section('Why JSON requires quoted keys', [
        'Quoted keys remove ambiguity. A bare word could be a variable name in a programming language, but JSON has no variables. It represents data, not executable expressions. Requiring double-quoted keys makes the format predictable across languages and parsers.',
        'This rule also supports keys that contain spaces, hyphens, dots, or other characters. `"request-id"` and `"user name"` are valid JSON keys. Without quotes, those names would be hard to parse consistently.',
      ]),
      section('How to fix the issue', [
        'Wrap every object property name in double quotes. Do not change string values that are already correctly quoted. After wrapping the key, keep the colon after the closing quote, then ensure commas separate each property.',
        'For example, change `enabled: true` to `"enabled": true`. Change `request-id: "abc"` to `"request-id": "abc"`. If the key contains a double quote, it must be escaped, but that is uncommon in API payloads and configuration files.',
      ]),
      section('How to avoid it next time', [
        'If the source is JavaScript, use `JSON.stringify(value, null, 2)` to export strict JSON instead of copying an object literal manually. If the source is documentation, check whether the example is meant to be JavaScript or JSON. Many docs use JavaScript object notation for readability even when an API expects JSON.',
        'JSONFmt detects common unquoted key patterns and points at the key. After you add quotes, validate again. If the next error is a missing comma or single quote, fix that separately instead of trying to rewrite the whole document at once.',
      ]),
    ],
    faq: [
      ['Do JSON property names need quotes?', 'Yes. Every JSON object property name must be wrapped in double quotes.'],
      ['Are unquoted keys valid in JavaScript?', 'Often yes, but JavaScript object literal syntax is not the same as strict JSON syntax.'],
      ['Can a JSON key contain a hyphen?', 'Yes, as long as the key is quoted, for example `"request-id"`.'],
    ],
  }),
  guide({
    slug: 'unclosed-string-in-json',
    title: 'Unclosed String in JSON: How to Find the Missing Quote',
    description: 'Learn how unclosed strings break JSON parsing, where the missing quote usually is, and how to fix the value safely.',
    summary: 'An unclosed string starts with a double quote but never closes before the parser reaches invalid text or the end of input.',
    primaryKeyword: 'unclosed string in JSON',
    invalidCode: `{
  "message": "Deploy started,
  "status": "running"
}`,
    fixedCode: `{
  "message": "Deploy started",
  "status": "running"
}`,
    sections: [
      section('What an unclosed string is', [
        'A JSON string begins with a double quote and must end with a matching double quote. If the closing quote is missing, the parser keeps reading as if the next characters are still part of the string. Eventually it reaches a line break, another property, or the end of the file and reports a syntax error.',
        'This article is for developers dealing with pasted logs, generated messages, or manually edited API payloads. The fix is usually to add the missing closing quote or escape characters that accidentally broke the string.',
      ]),
      section('Line breaks inside strings', [
        'A literal line break cannot appear inside a JSON string. If a value needs a line break, it must be escaped as `\\n`. This is a frequent source of unclosed string or control character errors. The text looks like a normal multiline message, but strict JSON requires the message to stay on one logical line or use escape sequences.',
        'For example, `"message": "line one\\nline two"` is valid. A real newline between `line one` and `line two` inside the quotes is invalid JSON.',
      ]),
      section('How to find the missing quote', [
        'Start at the highlighted location and move backward to the nearest opening quote. Check whether that string has a closing quote before the comma, brace, or bracket that follows it. If a property name appears in the same color as the previous string in your editor, the previous string probably swallowed it.',
        'Do not simply add a quote at the error location without checking the intended value. You may need to escape a quote inside the value instead. For example, `"message": "User said "ok""` is invalid because the inner quote ends the string early. The fixed form is `"message": "User said \\"ok\\""`. ',
      ]),
      section('Validate after the fix', [
        'After adding the closing quote or escape sequence, validate the JSON again. One string error can hide later errors because the parser loses track of structure. Once the string is fixed, the next issue, if any, will become easier to locate.',
        'JSONFmt highlights the detected line and column and explains the likely missing quote. It keeps the original input unchanged so you can make the repair yourself and preserve the data exactly as intended.',
      ]),
    ],
    faq: [
      ['Can JSON strings span multiple lines?', 'Not with literal line breaks. Use escape sequences such as `\\n` inside the string value.'],
      ['How do I include a quote inside a JSON string?', 'Escape the quote with a backslash, for example `"User said \\"ok\\""`.'],
      ['Why does one missing quote create many errors?', 'Once a string is unclosed, the parser treats later text as part of that string and loses the intended structure.'],
    ],
  }),
  guide({
    slug: 'comments-in-json',
    title: 'Comments in JSON: Why // and /* */ Break Strict JSON',
    description: 'JSON does not support comments. Learn why comment syntax fails and what to use instead in config files and API payloads.',
    summary: 'Comments are useful in code, but strict JSON is a data format and does not allow `//` or block comments.',
    primaryKeyword: 'comments in JSON',
    invalidCode: `{
  // production API endpoint
  "baseUrl": "https://api.example.com"
}`,
    fixedCode: `{
  "baseUrl": "https://api.example.com"
}`,
    sections: [
      section('Are comments valid in JSON?', [
        'No. Strict JSON does not allow line comments with `//` or block comments with `/* ... */`. If a parser sees a slash where it expects a property name or value, it throws a syntax error. Some configuration formats that look like JSON allow comments, but those formats are not strict JSON.',
        'This article is for developers who are moving data between config files, API clients, and validators. If the destination expects JSON, remove comments before sending or storing the data.',
      ]),
      section('Why the rule exists', [
        'JSON was designed as a lightweight data-interchange format. It intentionally avoids programming-language features such as comments, functions, variables, and expressions. That makes it easier for parsers in many languages to agree on exactly what a document means.',
        'Comments can also create problems when JSON is signed, minified, cached, or transmitted between systems. A system receiving the payload expects data only. Extra comment text would need special handling, and strict JSON chooses not to allow that ambiguity.',
      ]),
      section('How to fix JSON with comments', [
        'Remove the comments before validating or sending the JSON. If the note is important, move it into documentation outside the JSON file. For configuration files, consider whether the actual format is JSONC, JSON5, YAML, or another comment-friendly format. Do not assume that an API accepting JSON will accept commented JSON.',
        'If you need a human-readable explanation inside data, use a real property only when the receiving system allows it. For example, `"_comment": "production API endpoint"` is syntactically valid JSON, but it changes the data shape and may be rejected by strict schemas.',
      ]),
      section('How JSONFmt handles comments', [
        'JSONFmt validates strict JSON. When it sees `//` or `/*` outside a string, it reports that comments are not valid in standard JSON. It does not silently strip the comment because that would change the text you pasted. You decide whether to delete the comment, move it elsewhere, or convert the file to a different format.',
        'After comments are removed, validate again and then format the document. Clean formatting makes it easier to review the remaining object and array structure.',
      ]),
    ],
    faq: [
      ['Does JSON support comments?', 'No. Strict JSON does not support line comments or block comments.'],
      ['What is JSONC?', 'JSONC is a JSON-like format with comments, often used by some developer tools. It is not strict JSON.'],
      ['Can I use `_comment` fields?', 'Technically yes, but only if the receiving system allows extra fields. It changes the actual JSON data.'],
    ],
  }),
]

GUIDE_PAGES.push(
  guide({
    slug: 'how-to-format-json',
    title: 'How to Format JSON Online Without Uploading It',
    description: 'Learn how to format JSON online in your browser, make nested data readable, and validate the result before using it in an API or config file.',
    summary: 'Formatting JSON adds clear indentation so you can read, review, and debug nested data without changing its meaning.',
    primaryKeyword: 'how to format JSON',
    invalidCode: `{"service":"billing","enabled":true,"regions":["us-east","eu-west"]}`,
    fixedCode: `{
  "service": "billing",
  "enabled": true,
  "regions": ["us-east", "eu-west"]
}`,
    sections: [
      section('What formatting JSON changes', [
        'Formatting JSON changes whitespace, indentation, and line breaks so the structure is easier to read. It does not change property names, string values, numbers, booleans, arrays, or objects. A formatted payload should parse to exactly the same data structure as its minified version.',
        'This is useful when you receive an API response on one long line, inspect a configuration file, or need to review a JSON fixture in a pull request. Indentation makes object boundaries and array items visible, which reduces the chance of missing a key or reading a nested value in the wrong place.',
      ]),
      section('How to format JSON safely', [
        'Start with strict valid JSON. Paste the text into JSONFmt, wait for the validation result, and use the format action only after the tool reports that the document is valid. If formatting is unavailable, fix the first syntax error shown in the diagnostic panel before trying again.',
        'Do not use formatting as a substitute for validation. An editor can make invalid JSON look neat while it is still missing a comma, using single quotes, or containing a comment. The safe order is validate first, format second, then review the expanded structure.',
      ]),
      section('Choose an indentation style', [
        'Most developer tools use two spaces or four spaces for JSON indentation. The exact width does not change the parsed value, so use the convention of the repository or service where the JSON will live. Consistent indentation matters more than the specific number of spaces.',
        'Avoid tabs when a team or tool requires spaces. Tabs can display at different widths in different editors, which makes deeply nested JSON harder to compare. A browser formatter gives every nested level a predictable shape that works well in diffs and code review.',
      ]),
      section('When formatted JSON reveals a problem', [
        'The formatted shape can reveal semantic surprises after the syntax becomes valid. For example, an object may be nested one level deeper than expected, an array may contain an unexpected item, or a property may have been duplicated in source data. Formatting does not decide whether the data is correct, but it makes those questions easier to answer.',
        'After formatting, compare the visible shape against the API contract, schema, or configuration documentation. When the JSON contains private values, keep the review local and avoid copying the full payload into tickets or shared chat messages.',
      ]),
    ],
    faq: [
      ['Does formatting JSON change the data?', 'No. A formatter changes whitespace and indentation, not the JSON values or structure.'],
      ['Can I format invalid JSON?', 'No. Fix the syntax error first, then format the valid document.'],
      ['Is online JSON formatting private on JSONFmt?', 'Yes. JSONFmt formats and validates the input locally in your browser.'],
    ],
  }),
  guide({
    slug: 'how-to-validate-json',
    title: 'How to Validate JSON and Find Syntax Errors',
    description: 'Learn how to validate JSON, understand parser errors, and fix invalid JSON locally before sending it to an API, tool, or configuration workflow.',
    summary: 'JSON validation checks whether text follows strict JSON syntax before another system tries to parse it.',
    primaryKeyword: 'how to validate JSON',
    invalidCode: `{
  "environment": "production"
  "retries": 3
}`,
    fixedCode: `{
  "environment": "production",
  "retries": 3
}`,
    sections: [
      section('What JSON validation checks', [
        'A JSON validator checks whether a document follows the strict JSON grammar. It verifies that object keys use double quotes, commas appear between values, strings are closed, brackets match, and the text represents one complete JSON value. Validation is about syntax, not whether the values make sense for a specific API.',
        'For example, a validator can confirm that `"retries": 3` is syntactically valid, but it cannot know whether an API expects retries to be three, five, or a string. Use a schema or application contract for semantic rules after the JSON syntax is valid.',
      ]),
      section('How to read a validation error', [
        'Start with the line and column reported by the parser, then inspect the previous meaningful character. A parser often stops where it notices the problem, but the cause may be just before that position. A quote may be unexpected because a comma was missing on the line above, not because the quote itself is wrong.',
        'JSONFmt shows the error location, nearby context, an explanation, and a suggested manual repair for common patterns. Make one small change at a time and validate again. Fixing the first error can expose another error that the parser could not reach earlier.',
      ]),
      section('Validate before formatting or sending', [
        'Validate JSON before using it in an API client, saving it as a configuration file, or committing it to a repository. A request can fail before reaching application logic when the HTTP body is not valid JSON. A configuration file can also break a build or deployment before the service starts.',
        'Once the validator reports success, format the JSON for a structural review or minify it if a compact representation is required. Those transformations are safe only after parsing succeeds, because they operate on the parsed data rather than guessing how to repair invalid text.',
      ]),
      section('Keep validation private', [
        'Validation is often performed on logs and API payloads that may contain credentials, personal data, or internal URLs. Use a browser-local tool and still minimize the data when sharing a reproduction with another person. Replace secrets with placeholders before opening a support issue or sending an example.',
        'A local validator is especially useful for checking a payload before it reaches a third-party service. JSONFmt processes the text in the browser and does not send the contents to a server, account, or history store.',
      ]),
    ],
    faq: [
      ['What does a JSON validator check?', 'It checks strict JSON syntax such as quotes, commas, brackets, strings, and complete document structure.'],
      ['Is valid JSON always valid for my API?', 'No. Syntax validation is separate from API-specific schema and business rules.'],
      ['Why does the parser point at the wrong line?', 'The location is where parsing failed; the original syntax mistake is often immediately before it.'],
    ],
  }),
  guide({
    slug: 'how-to-minify-json',
    title: 'How to Minify JSON Safely for APIs and Config Files',
    description: 'Learn how to minify JSON safely, reduce whitespace without changing data, and validate the compact result before using it in an API or configuration workflow.',
    summary: 'Minifying JSON removes unnecessary whitespace while preserving the exact parsed data structure.',
    primaryKeyword: 'how to minify JSON',
    invalidCode: `{
  "feature": "alerts",
  "channels": [
    "email",
    "webhook"
  ]
}`,
    fixedCode: `{"feature":"alerts","channels":["email","webhook"]}`,
    sections: [
      section('What JSON minification removes', [
        'JSON minification removes spaces, indentation, and line breaks that are not part of a string value. The parser sees the same keys, values, arrays, and objects after minification. The main purpose is to reduce the number of bytes transmitted or stored when the readable layout is not needed.',
        'A minified document is harder for a person to inspect manually, so keep a formatted source version when people need to edit or review the data. Minification is best treated as an output step, not as the primary editing format for configuration files or test fixtures.',
      ]),
      section('Validate before minifying', [
        'A minifier must parse the JSON before it can safely remove whitespace. If the input has a trailing comma, single-quoted string, comment, or unclosed bracket, the tool should stop instead of guessing what the data was meant to be. Fix syntax errors first, then minify the valid document.',
        'JSONFmt keeps the format and minify actions disabled until strict validation succeeds. This makes the operation predictable: a successful minify action means the document was parseable JSON immediately before the transformation.',
      ]),
      section('When minified JSON is useful', [
        'Compact JSON can reduce the size of static fixtures, embedded data, or manually prepared request bodies. It can also be useful when a system has a strict size limit and the data is already known to be valid. The savings come only from whitespace, so large string values and arrays may still dominate the payload size.',
        'For normal API requests, modern HTTP compression often reduces whitespace automatically. Minification can still help in environments where payloads are stored directly, copied into source files, or sent through systems without compression.',
      ]),
      section('Avoid changing string values', [
        'Only whitespace outside JSON strings is safe to remove. A space inside `"display name"` is part of the actual value and must stay. A reliable minifier parses the document instead of using a global replace operation, which could corrupt meaningful spaces, escaped characters, or multiline text represented with escape sequences.',
        'After minifying, validate once more if the compact output is going into another tool. When the output needs to be reviewed by a person later, reformat it instead of trying to read a long single-line document.',
      ]),
    ],
    faq: [
      ['Does minifying JSON change string values?', 'No. A safe minifier removes only whitespace outside strings and preserves the parsed data.'],
      ['Can minified JSON be formatted again?', 'Yes. Valid minified JSON can be formatted back into a readable indented layout.'],
      ['Should I minify a JSON config file?', 'Only when compact size is more important than direct human readability.'],
    ],
  }),
  guide({
    slug: 'json-formatter-vs-validator',
    title: 'JSON Formatter vs Validator: What Each Tool Does',
    description: 'Understand the difference between a JSON formatter and JSON validator, when to use each one, and how formatting, validation, and minification fit together.',
    summary: 'A validator checks strict JSON syntax; a formatter makes already valid JSON easier to read.',
    primaryKeyword: 'json formatter vs validator',
    invalidCode: `{
  'service': 'payments',
  "timeout": 30,
}`,
    fixedCode: `{
  "service": "payments",
  "timeout": 30
}`,
    sections: [
      section('The short difference', [
        'A JSON validator answers a syntax question: can a strict parser read this text as JSON? A JSON formatter answers a presentation question: can this valid JSON be laid out with readable indentation and line breaks? The tools are related, but formatting depends on validation because a formatter needs a parseable document.',
        'When you paste JSON into JSONFmt, validation happens first. If the text is invalid, the diagnostic panel explains the first syntax problem. If it is valid, you can format it for review or minify it for a compact representation.',
      ]),
      section('When to use a validator', [
        'Use a validator when an API client rejects a payload, a configuration file fails to load, a JSON.parse call throws, or copied data looks suspicious. The validator identifies syntax issues such as missing commas, trailing commas, comments, single quotes, unquoted keys, and unmatched brackets.',
        'Validation should happen before any downstream step that assumes JSON is readable. It catches the format-level problem early, close to the text that caused it, instead of making you debug a generic application error later in a request pipeline or deployment log.',
      ]),
      section('When to use a formatter', [
        'Use a formatter after the JSON is valid and you need to inspect the structure. Nested arrays and objects are much easier to reason about when each level has consistent indentation. Formatting also helps reviewers spot unexpected nesting, duplicate-looking fields, or values that appear under the wrong parent object.',
        'Formatting is not an automatic repair tool. If a document is invalid, formatters that claim to repair it may make an assumption about your intended data. JSONFmt keeps the original text in place and shows a manual fix suggestion instead.',
      ]),
      section('Where minification fits', [
        'Minification is the inverse presentation step: it removes nonessential whitespace from valid JSON. Use it after validation when a compact payload is useful. It is not a validator replacement, because a minifier should reject invalid text instead of removing characters blindly.',
        'A practical workflow is validate, format, review, then minify only when the compact output is actually needed. That order gives you readable structure during debugging and a smaller payload at the final handoff.',
      ]),
    ],
    faq: [
      ['Can a formatter validate JSON?', 'A formatter must parse JSON first, but a dedicated validator provides clearer error diagnosis when syntax is invalid.'],
      ['Can a validator format JSON?', 'Some tools include both actions. Validation still happens before formatting can safely run.'],
      ['What is the safest JSON workflow?', 'Validate first, format for review, and minify only when compact output is needed.'],
    ],
  }),
)

export const TOOL_PAGES = [
  tool({
    slug: 'json-formatter',
    title: 'JSON Formatter Online - Format JSON Locally',
    description: 'Format JSON online in your browser. Make valid JSON readable with clean indentation without uploading or storing your data.',
    heading: 'JSON formatter',
    summary: 'Paste valid JSON, format it into a readable structure, and keep the entire workflow in your browser.',
    primaryKeyword: 'json formatter',
    action: 'Format JSON',
    sections: [
      section('Format JSON without leaving your browser', [
        'JSONFmt formats strict valid JSON locally so you can inspect nested objects and arrays without uploading API payloads, configuration files, or logs.',
        'Use the formatter after validation succeeds to turn a compact response into an indented document that is easier to review and copy.',
      ]),
      section('When formatting helps most', [
        'Formatting is useful for API responses, test fixtures, configuration files, and copied request bodies that arrive on one long line.',
        'It changes presentation only. Keys, values, arrays, and object structure remain the same after formatting.',
      ]),
    ],
    faq: [
      ['Is this JSON formatter private?', 'Yes. JSONFmt processes JSON locally in your browser and does not upload it.'],
      ['Can I format invalid JSON?', 'Fix the reported syntax issue first, then format the valid JSON.'],
      ['Does formatting change JSON values?', 'No. It changes whitespace and indentation only.'],
    ],
  }),
  tool({
    slug: 'json-validator',
    title: 'JSON Validator Online - Check JSON Syntax Locally',
    description: 'Validate JSON online in your browser. Find strict JSON syntax errors with line, column, and fix guidance without uploading your data.',
    heading: 'JSON validator',
    summary: 'Check whether JSON is valid, locate the first syntax error, and get a clear explanation before sending the data anywhere.',
    primaryKeyword: 'json validator',
    action: 'Validate JSON',
    sections: [
      section('Check strict JSON syntax', [
        'JSONFmt validates standard JSON syntax and flags common issues such as missing commas, trailing commas, comments, single quotes, and unclosed strings.',
        'The diagnostic panel identifies the line and column where parsing stopped, then explains the likely correction in plain language.',
      ]),
      section('Validate before the next system does', [
        'Run validation before pasting a payload into an API client, committing a JSON config file, or passing text into JSON.parse.',
        'Syntax validation confirms the document can be parsed; schema and application rules should be checked separately when they apply.',
      ]),
    ],
    faq: [
      ['What does a JSON validator check?', 'It checks strict JSON syntax, including quotes, commas, strings, brackets, and full document structure.'],
      ['Does JSONFmt validate JSON5?', 'No. JSONFmt validates strict standard JSON only.'],
      ['Is JSON input stored?', 'No. The browser processes the input locally.'],
    ],
  }),
  tool({
    slug: 'json-minifier',
    title: 'JSON Minifier Online - Minify JSON Locally',
    description: 'Minify valid JSON online in your browser. Remove unnecessary whitespace without changing the data or uploading your JSON.',
    heading: 'JSON minifier',
    summary: 'Compact valid JSON by removing indentation and unnecessary whitespace while preserving the exact parsed data.',
    primaryKeyword: 'json minifier',
    action: 'Minify JSON',
    sections: [
      section('Make valid JSON compact', [
        'JSONFmt minifies parseable JSON by removing whitespace outside string values. The output represents the same keys, values, arrays, and objects.',
        'Use minification for compact fixtures, embedded data, or request bodies when readability is no longer the priority.',
      ]),
      section('Validation comes first', [
        'Invalid JSON cannot be safely minified because the parser cannot identify which spaces or characters belong to the data structure.',
        'Fix the first syntax issue, validate again, then use the minify action to create a compact local result.',
      ]),
    ],
    faq: [
      ['Does minifying JSON remove spaces inside strings?', 'No. A safe minifier preserves every string value exactly.'],
      ['Can I format minified JSON again?', 'Yes. Any valid minified JSON can be formatted into a readable layout.'],
      ['Is the minifier browser-local?', 'Yes. JSONFmt does not upload the JSON you minify.'],
    ],
  }),
  tool({
    slug: 'json-beautifier',
    title: 'JSON Beautifier Online - Beautify JSON Locally',
    description: 'Beautify JSON online with readable indentation and local browser processing. Validate and clean up valid JSON without uploads.',
    heading: 'JSON beautifier',
    summary: 'Beautify valid JSON into a clean, readable layout for debugging, review, and configuration work.',
    primaryKeyword: 'json beautifier',
    action: 'Beautify JSON',
    sections: [
      section('Beautify JSON for inspection', [
        'JSON beautification is another name for formatting JSON with consistent line breaks and indentation.',
        'The readable layout helps developers trace nested objects, arrays, and configuration values without altering the data itself.',
      ]),
      section('Use a parser-backed beautifier', [
        'A parser-backed tool works from the actual JSON structure, so it will stop and report syntax problems rather than rearranging invalid text.',
        'JSONFmt keeps your input local and provides a direct error explanation when the content needs repair before beautification.',
      ]),
    ],
    faq: [
      ['Is JSON beautifier different from JSON formatter?', 'They describe the same core task: making valid JSON readable with indentation.'],
      ['Can a beautifier repair invalid JSON?', 'JSONFmt explains the syntax issue and lets you repair it manually first.'],
      ['Does beautifying JSON change the object structure?', 'No. It changes only the visible whitespace.'],
    ],
  }),
  tool({
    slug: 'json-pretty-print',
    title: 'JSON Pretty Print Online - Readable JSON Locally',
    description: 'Pretty print JSON online in your browser. Turn valid compact JSON into an indented, readable document without uploading it.',
    heading: 'JSON pretty print',
    summary: 'Pretty print valid JSON into an organized layout that is easier to scan, debug, and review.',
    primaryKeyword: 'json pretty print',
    action: 'Pretty print JSON',
    sections: [
      section('Turn compact JSON into readable JSON', [
        'Pretty printing expands a one-line or densely packed JSON document into an indented structure with clear object and array boundaries.',
        'It is especially useful when an API response, log entry, or environment value is difficult to understand in compact form.',
      ]),
      section('Keep the data intact', [
        'Pretty printing changes whitespace around the JSON structure but leaves values and property names intact.',
        'JSONFmt validates first, so you do not receive a polished-looking document that still fails a strict JSON parser.',
      ]),
    ],
    faq: [
      ['What is JSON pretty print?', 'It is formatting valid JSON with indentation and line breaks for easier reading.'],
      ['Can I pretty print an API response?', 'Yes, as long as the response body is valid strict JSON.'],
      ['Will pretty printing upload my JSON?', 'No. JSONFmt processes it in your browser.'],
    ],
  }),
  tool({
    slug: 'json-error-finder',
    title: 'JSON Error Finder - Locate and Fix Invalid JSON',
    description: 'Find JSON syntax errors with line and column guidance. Diagnose invalid strict JSON locally in your browser without uploads.',
    heading: 'JSON error finder',
    summary: 'Locate the first JSON syntax error, understand why it happened, and repair the text without sending it to a server.',
    primaryKeyword: 'json error finder',
    action: 'Find JSON errors',
    sections: [
      section('Find the first blocking syntax error', [
        'JSONFmt points to the line and column where strict JSON parsing stopped and pairs the location with nearby context.',
        'Common error patterns receive an explanation and a manual repair suggestion instead of a raw parser message alone.',
      ]),
      section('Repair JSON in small steps', [
        'Fix one reported issue, validate again, and repeat until the full document is valid. One missing quote or comma can hide later problems.',
        'The tool does not auto-rewrite your JSON, so you keep control of values that may be sensitive or business-critical.',
      ]),
    ],
    faq: [
      ['Why does JSONFmt show only one error at a time?', 'A parser must recover from the first syntax error before it can reliably inspect later text.'],
      ['Can it find trailing commas?', 'Yes. JSONFmt classifies several common strict JSON syntax patterns.'],
      ['Does the error finder upload API payloads?', 'No. Processing happens locally in the browser.'],
    ],
  }),
  tool({
    slug: 'fix-invalid-json',
    title: 'Fix Invalid JSON - Diagnose JSON Syntax Errors',
    description: 'Fix invalid JSON with local syntax diagnostics, line and column locations, and practical repair guidance for common strict JSON errors.',
    heading: 'Fix invalid JSON',
    summary: 'Diagnose invalid JSON, understand the parser message, and make the smallest correct repair in your browser.',
    primaryKeyword: 'fix invalid json',
    action: 'Diagnose JSON',
    sections: [
      section('Start with the reported location', [
        'When JSON is invalid, the displayed line and column show where the parser could no longer continue. The real cause is often on that line or immediately before it.',
        'Check for missing commas, extra commas, mismatched brackets, comments, single quotes, unquoted keys, and unclosed strings before making a broad rewrite.',
      ]),
      section('Preserve the intended data', [
        'The safest fix is a small manual change followed by another validation pass. Blind replacements can change apostrophes, string values, or object structure.',
        'JSONFmt keeps all repair work local and gives you the context needed to decide what the input was meant to say.',
      ]),
    ],
    faq: [
      ['Can JSONFmt automatically fix JSON?', 'No. It identifies likely syntax issues and lets you make the intended repair yourself.'],
      ['What causes invalid JSON most often?', 'Missing commas, trailing commas, single quotes, comments, and unmatched brackets are common causes.'],
      ['Can I fix a large JSON file here?', 'JSONFmt supports browser-local JSON input up to 10 MB.'],
    ],
  }),
  tool({
    slug: 'json-viewer',
    title: 'JSON Viewer Online - Validate and Read JSON Locally',
    description: 'View JSON locally in your browser. Validate and format valid JSON into a readable structure without uploads or storage.',
    heading: 'JSON viewer',
    summary: 'Open JSON in a readable local workspace, validate the syntax, and format the structure for inspection.',
    primaryKeyword: 'json viewer',
    action: 'View JSON',
    sections: [
      section('Read JSON with structure', [
        'A JSON viewer helps turn dense response text into a readable object and array layout. JSONFmt uses formatting and a structural summary to make valid JSON easier to inspect.',
        'This first version keeps the editor at the center of the experience, so you can view, correct, format, minify, and copy the same local text.',
      ]),
      section('Validate before you trust the layout', [
        'A document must be valid strict JSON before it can be reliably displayed as a structured value. Invalid input stays in the editor with a diagnostic rather than being silently guessed at.',
        'For deeply nested documents, formatting first makes object boundaries clearer and creates a practical reading view without sending content outside the browser.',
      ]),
    ],
    faq: [
      ['Can JSONFmt display invalid JSON?', 'It displays the text and diagnostic, but a structured view requires valid JSON.'],
      ['Does JSONFmt have a tree viewer?', 'The current viewer focuses on formatted structure and diagnostics; tree navigation is a later enhancement.'],
      ['Is JSON viewing private?', 'Yes. JSONFmt processes the input locally in your browser.'],
    ],
  }),
]

export const TRUST_PAGES = [
  trust({
    path: '/privacy/',
    title: 'Privacy Policy - JSONFmt',
    description: 'Read the JSONFmt privacy policy. JSON is processed locally in your browser and is not uploaded or stored by this tool.',
    heading: 'Privacy Policy',
    sections: [
      ['Overview', [
        'JSONFmt is designed as a privacy-first JSON formatting and validation tool. The JSON you paste, type, import, or drag into the editor is processed locally in your browser.',
        'We do not operate a server-side JSON parser, account system, database, or cloud history for your JSON input.',
      ]],
      ['JSON content', [
        'Your JSON content is not uploaded, saved, sold, shared, or added to analytics events. Formatting, minifying, and syntax diagnosis happen on your device.',
        'Because JSON may contain secrets, tokens, personal data, or internal API responses, you should still review what you paste into any browser-based tool.',
      ]],
      ['Cookies and future advertising', [
        'V2 does not include live advertising scripts or analytics scripts. In the future, JSONFmt may use Google AdSense or similar advertising services. These services may use cookies, device identifiers, IP addresses, or similar technologies to deliver and measure ads.',
        'If advertising is added, this policy should be updated before those scripts are enabled.',
      ]],
      ['Contact', [
        `For privacy questions, contact the JSON Formatter team at ${CONTACT_EMAIL}.`,
      ]],
    ],
  }),
  trust({
    path: '/terms/',
    title: 'Terms of Use - JSONFmt',
    description: 'Read the JSONFmt terms of use for the free browser-based JSON formatter, validator, and error finder.',
    heading: 'Terms of Use',
    sections: [
      ['Using the tool', [
        'JSONFmt provides a free browser-based JSON formatter, validator, minifier, and syntax diagnostic tool. You may use it to inspect and repair JSON at your own discretion.',
        'The tool is provided for convenience and may not catch every possible issue in a workflow, schema, API contract, or downstream system.',
      ]],
      ['No warranty', [
        'JSONFmt is provided as is, without warranties of any kind. You are responsible for reviewing any output before using it in production systems, configuration files, or API requests.',
        'The tool does not intentionally change invalid JSON. It explains syntax issues so you can make the edit yourself.',
      ]],
      ['Acceptable use', [
        'Do not use JSONFmt to attack, overload, probe, or disrupt the site. Do not attempt to reverse engineer or bypass technical protections.',
        'Because JSON is processed locally, you remain responsible for the content you paste or import.',
      ]],
      ['Contact', [
        `Questions about these terms can be sent to ${CONTACT_EMAIL}.`,
      ]],
    ],
  }),
  trust({
    path: '/about/',
    title: 'About JSONFmt - Private JSON Formatter and Error Finder',
    description: 'Learn about JSONFmt, a browser-based JSON formatter and error finder built for developers who need fast, private validation.',
    heading: 'About JSONFmt',
    sections: [
      ['Why JSONFmt exists', [
        'JSONFmt helps developers diagnose invalid JSON quickly without sending their data to a server. The tool focuses on strict JSON validation, clear error explanations, formatting, minifying, and practical repair guidance.',
        'Many JSON tools simply say that a document is invalid. JSONFmt tries to make the next step obvious: where the parser failed, what likely caused it, and how to fix the syntax manually.',
      ]],
      ['Built for developers', [
        'The interface is intentionally close to a development workspace. The editor is the center of the page, diagnostics stay nearby, and privacy language is visible without getting in the way.',
        'The guide library explains common JSON syntax problems with invalid examples, fixed examples, and short troubleshooting notes.',
      ]],
      ['Who maintains it', [
        `JSONFmt is maintained by the JSON Formatter team. For feedback, corrections, or content suggestions, contact ${CONTACT_EMAIL}.`,
      ]],
    ],
  }),
  trust({
    path: '/contact/',
    title: 'Contact JSONFmt',
    description: 'Contact the JSON Formatter team for feedback, corrections, privacy questions, or JSONFmt site issues.',
    heading: 'Contact',
    sections: [
      ['Get in touch', [
        `For feedback, corrections, privacy questions, or site issues, email the JSON Formatter team at ${CONTACT_EMAIL}.`,
        'Please do not email private JSON payloads, API tokens, passwords, customer data, or production secrets. Describe the issue without including sensitive data whenever possible.',
      ]],
      ['What to include', [
        'If you are reporting a documentation issue, include the page URL and a short description. If you are reporting a tool behavior issue, include the browser name and a simplified example that does not contain private data.',
      ]],
    ],
  }),
]

export const GUIDES_INDEX = {
  kind: 'guides-index',
  path: '/guides/',
  canonical: `${SITE_URL}/guides/`,
  title: 'JSON Error Guides - Fix Common JSON Syntax Errors',
  description: 'Developer-focused guides for fixing trailing commas, unexpected tokens, single quotes, unquoted keys, unclosed strings, and comments in JSON.',
}

export const TOOLS_INDEX = {
  kind: 'tools-index',
  path: '/tools/',
  canonical: `${SITE_URL}/tools/`,
  title: 'JSON Tools - Formatter, Validator, Minifier, and Error Finder',
  description: 'Use privacy-first JSON tools to format, validate, minify, view, and diagnose strict JSON locally in your browser.',
}

export const HOME_PAGE = {
  kind: 'home',
  path: '/',
  canonical: `${SITE_URL}/`,
  title: 'JSON Formatter and Validator - JSONFmt',
  description: 'Format, validate, minify, and fix JSON syntax errors locally in your browser. Your JSON stays on your device.',
}

export const PAGE_ROUTES = [
  HOME_PAGE,
  TOOLS_INDEX,
  ...TOOL_PAGES,
  GUIDES_INDEX,
  ...GUIDE_PAGES,
  ...TRUST_PAGES,
]

function getExtraGuideSections(slug) {
  return ({
  'trailing-comma-in-json': [
    section('Checklist before you send the JSON', [
      'After removing a trailing comma, check the surrounding object or array instead of validating only that one line. A trailing comma often appears after a manual edit, and the same edit may have left another property without a comma above it. Confirm that every item before the final item is separated correctly, then run the validator again.',
      'If the payload came from source code, look for JavaScript-specific syntax before using it as JSON. A copied object literal may also contain comments, single quotes, `undefined`, or unquoted keys. Fixing the trailing comma is only the first step if the source was not strict JSON in the first place.',
    ]),
    section('How to prevent trailing comma regressions', [
      'For shared configuration files, prefer generated JSON or an editor formatter that validates strict JSON on save. If your team wants comments and trailing commas in configuration, consider using a format that explicitly supports them, then convert to strict JSON only at the boundary where an API or parser requires it.',
      'For API examples in documentation, keep the example payloads strict. Readers often copy examples directly into Postman, curl, SDK tests, or online validators. A single trailing comma can make the example look broken even when the API contract is correct.',
    ]),
  ],
  'unexpected-token-in-json': [
    section('A practical debugging order', [
      'Treat the parser message as a starting point, not a final diagnosis. First identify the token reported by the parser. Then inspect the previous non-whitespace character. If the token is a quote and the previous value already ended, a comma is probably missing. If the token is a brace after a comma, the comma is probably extra.',
      'Next, check whether the file is actually JSON. Unexpected token errors are common when an HTML error page, JavaScript object, YAML file, or plain text response is accidentally parsed as JSON. If the first character is `<`, the server may have returned HTML. If keys are unquoted, the text may be JavaScript-style data rather than JSON.',
    ]),
    section('When the error comes from an API response', [
      'In browser or Node.js code, unexpected token errors often appear after calling `response.json()`. The bug may not be in your JSON editor at all. The response might be empty, truncated, compressed incorrectly, or replaced by a login page or server error. Always check the raw response body and status code before assuming the client parser is wrong.',
      'If you paste the raw response into JSONFmt and the same category appears, repair the payload or fix the API output. If JSONFmt says the pasted response is valid, the issue may be transport related, such as double parsing, wrong content type, or application code reading the response stream twice.',
    ]),
  ],
  'single-quotes-in-json': [
    section('Safe replacement strategy', [
      'Do not replace every apostrophe blindly. The unsafe pattern is to run a global replacement from single quote to double quote without understanding string boundaries. That can corrupt values like names, contractions, or text copied from logs. Instead, replace only the quote characters that start and end JSON keys or string values.',
      'A safer workflow is to fix the outer delimiters, validate, and then deal with any new error reported by the parser. If a value contains a double quote, escape it as `\\"`. If a value contains an apostrophe and the string uses double quotes, the apostrophe can remain unchanged.',
    ]),
    section('Why this matters in real API work', [
      'APIs that accept JSON usually parse the request body with a strict JSON parser. A payload that worked in a JavaScript test file can fail when sent over HTTP because the server receives text, not a JavaScript object. The server does not know about JavaScript variables, single-quoted strings, or object literal shortcuts.',
      'When writing examples for teammates or customers, always publish strict JSON. This prevents confusing support issues where the example appears correct to a JavaScript developer but fails in Python, Go, Java, curl, or an API gateway that uses a standards-compliant parser.',
    ]),
  ],
  'unquoted-property-name-in-json': [
    section('Keys that look simple still need quotes', [
      'The rule applies even when the key is a plain identifier such as `name`, `id`, or `enabled`. JSON does not make an exception for simple words. Every key is a string and every string key needs double quotes. This is different from JavaScript, where a bare identifier can be used as an object property name.',
      'The rule also protects less simple keys. Real API payloads often contain keys such as `request-id`, `user.name`, `x-api-version`, or `content type`. Quoting every key makes those names legal without inventing special cases for each punctuation mark or whitespace character.',
    ]),
    section('Fixing generated examples and docs', [
      'If the invalid JSON came from documentation, check whether the page labels the example as JavaScript or JSON. Many guides show JavaScript objects because they are easier to read in code snippets. Before using the example in an API client, convert it to strict JSON by quoting keys, using double quotes for strings, and removing comments.',
      'If the invalid JSON came from an application log, the log may be printing an object representation instead of serializing JSON. In that case, fix the logging or export step if you control it. A real JSON serializer is safer than editing many keys by hand.',
    ]),
  ],
  'unclosed-string-in-json': [
    section('Look for the first broken boundary', [
      'When a string is unclosed, later syntax highlighting can become misleading because the editor may treat the rest of the file as part of the same string. Do not chase every highlighted problem at once. Find the first opening quote that does not have a matching closing quote and fix that boundary first.',
      'The missing quote may be caused by copied multiline text, an unescaped double quote inside a message, or a truncated file. If the JSON came from a network response, also check whether the response body was cut off before the full payload arrived.',
    ]),
    section('Escaping without changing the meaning', [
      'The goal is to preserve the intended string value while making it legal JSON. Use `\\n` for a line break, `\\"` for a quote inside the value, and `\\\\` for a literal backslash. These escape sequences represent characters inside the value; they are not extra text the application should display.',
      'After escaping, validate the whole document and then inspect the parsed value in the application that consumes it. This is especially important for messages, regular expressions, Windows paths, and shell commands, where backslashes and quotes may already have meaning in another layer.',
    ]),
  ],
  'comments-in-json': [
    section('What to use instead of comments', [
      'If the JSON is an API request or response, put explanations in documentation, not inside the payload. If the JSON is a config file that humans edit often, decide whether strict JSON is the right format. YAML, TOML, JSONC, or JSON5 may be more appropriate for internal configuration, but they should not be sent to systems that expect strict JSON.',
      'Some teams use `_comment` properties, but that is a data change, not a syntax feature. It can break schemas, cause unknown-field errors, or accidentally ship notes to production systems. Use this pattern only when the consuming system explicitly allows extra fields.',
    ]),
    section('Comments can hide real payload issues', [
      'When a parser stops at `//`, it may not reach later errors in the document. After removing comments, validate again and be ready to fix additional strict JSON issues such as single quotes, trailing commas, or unquoted keys. This staged repair process is safer than trying to guess every problem at once.',
      'For shared examples, keep comments outside the JSON block. A short paragraph before or after the code sample gives readers the explanation without making the payload invalid. That habit helps API examples work across curl, Postman, SDK tests, CI jobs, and online validators.',
    ]),
  ],
  'how-to-format-json': [
    section('Use formatting in a repeatable workflow', [
      'When JSON is part of a recurring development workflow, format the payload before reviewing changes and keep the result under version control when it is a fixture or configuration file. Readable indentation makes diffs smaller and makes it easier for another developer to see whether a value changed or only the layout changed. For generated JSON, format a copy for inspection rather than editing a production output by hand.',
      'If you need to pass formatted JSON into another application, copy the complete validated result instead of reconstructing individual fragments. A single missing brace can undo the benefit of a clean layout. JSONFmt lets you validate, format, and copy in one local session, which keeps the review step close to the final text you will use.',
      'Use the same formatter settings across examples, fixtures, and documentation whenever possible. Consistent output makes it easier to compare a response captured today with one captured later, and it prevents a style-only change from obscuring the data change that actually matters.',
    ]),
  ],
  'how-to-validate-json': [
    section('Build validation into your handoff', [
      'Treat JSON validation as a checkpoint before handing data to another person, service, or environment. A quick local validation step can prevent a broken example from reaching documentation, a malformed request from reaching an API, or an invalid config from blocking a deployment. It is especially useful after manually editing a payload that was originally produced by a serializer.',
      'When a document passes validation, save the source in the form that suits the next task. Format it for human review, minify it only when compact size matters, and keep a small redacted sample for debugging instead of copying a sensitive production payload. That workflow protects both syntax quality and the confidentiality of the data.',
      'For automated workflows, validate generated files in tests or CI before release. A local browser validator is useful for investigation, while a repeatable parser check in the project catches accidental syntax regressions before another environment has to diagnose them.',
    ]),
  ],
  'how-to-minify-json': [
    section('Use minification at the right boundary', [
      'Minify JSON at the point where a compact representation is actually needed, such as a generated asset, embedded fixture, or constrained transport channel. Keep the editable source formatted whenever people are expected to read it. That separation avoids a common maintenance problem where a compact one-line configuration becomes the only copy and every later change is harder to review.',
      'Before shipping compact JSON, compare its behavior with the formatted version in the consuming application. Minification should not change the parsed result, but the receiving system can still impose schema, size, encoding, or content-type rules that are outside the JSON grammar. A clean validation result proves syntax, while an end-to-end check proves the surrounding integration.',
      'Keep a readable source beside any minified output when the project allows it. This gives developers a straightforward way to inspect future changes, regenerate the compact result, and isolate whether a problem came from the JSON itself or from a later transport, schema, or application rule.',
      'If you are unsure whether minification is worth it, measure the size before and after. Small payloads often shrink only a little, while large nested documents may save enough bytes to matter. That quick comparison helps you decide whether the compact form is actually useful.',
    ]),
  ],
  'json-formatter-vs-validator': [
    section('Choose the tool from the failure mode', [
      'Use the validator when a parser fails, an API rejects a body before processing it, or a copied snippet may contain JavaScript-style syntax. The outcome you need is a precise explanation of what prevents strict parsing. Use the formatter when the JSON is already valid but the structure is too dense to inspect, compare, or discuss confidently.',
      'Keeping these jobs separate also helps a team communicate clearly. A report that says "the JSON is invalid because the final property has a trailing comma" leads to a focused repair. A request to "format the valid response so we can inspect the nested array" describes a presentation task. JSONFmt supports both steps locally without turning formatting into a risky automatic repair feature.',
      'The distinction also improves debugging speed. Validation narrows down whether the parser can read the text at all, while formatting helps a person verify the shape after parsing succeeds. Moving through those two steps in order keeps syntax failures separate from data or integration questions.',
      'A tidy rule of thumb is simple: if the JSON cannot be parsed, validate it; if the JSON can be parsed but is hard to read, format it. That habit prevents teams from treating presentation as if it were syntax and keeps the review process direct.',
    ]),
  ],
  })[slug] ?? []
}

export function renderStaticPage(page, options = {}) {
  const cssLinks = options.cssLinks ?? []
  const scriptLinks = options.scriptLinks ?? []
  const jsonLd = getStructuredData(page)
  const searchConsoleVerificationMeta = getSearchConsoleVerificationMeta()
  const cloudflareWebAnalyticsScript = getCloudflareWebAnalyticsScript()
  const body = page.kind === 'tool'
    ? `<div id="root">${renderStaticBody(page)}</div>
    ${scriptLinks.map((href) => `<script type="module" crossorigin src="${href}"></script>`).join('\n    ')}`
    : `<main class="static-shell">
      ${renderStaticHeader()}
      ${renderStaticBody(page)}
      ${renderStaticFooter()}
    </main>`

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="robots" content="index,follow">
    ${searchConsoleVerificationMeta}
    <link rel="canonical" href="${page.canonical}">
    <meta property="og:type" content="${page.kind === 'guide' ? 'article' : 'website'}">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:title" content="${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:url" content="${page.canonical}">
    <meta name="twitter:card" content="summary">
    ${cssLinks.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n    ')}
    ${jsonLd.map((data) => `<script type="application/ld+json">${JSON.stringify(data)}</script>`).join('\n    ')}
  </head>
  <body>
    ${body}
    ${cloudflareWebAnalyticsScript}
  </body>
</html>
`
}

function getSearchConsoleVerificationMeta() {
  const token = process.env.GOOGLE_SITE_VERIFICATION?.trim()
  if (!token) return ''

  return `<meta name="google-site-verification" content="${escapeHtml(token)}">`
}

function getCloudflareWebAnalyticsScript() {
  if (!CLOUDFLARE_WEB_ANALYTICS_TOKEN) return ''

  return `<!-- Cloudflare Web Analytics --><script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "${CLOUDFLARE_WEB_ANALYTICS_TOKEN}"}'></script><!-- End Cloudflare Web Analytics -->`
}

export function buildSitemapXml() {
  const urls = PAGE_ROUTES.map((page) => `  <url>
    <loc>${page.canonical}</loc>
    <lastmod>${today}</lastmod>
  </url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

export function buildRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
}

export async function writeStaticPages(distDir = 'dist') {
  const cssLinks = await getBuiltCssLinks(distDir)
  const scriptLinks = await getBuiltScriptLinks(distDir)

  for (const page of [TOOLS_INDEX, ...TOOL_PAGES, GUIDES_INDEX, ...GUIDE_PAGES, ...TRUST_PAGES]) {
    const outputPath = path.join(distDir, page.path, 'index.html')
    await mkdir(path.dirname(outputPath), { recursive: true })
    await writeFile(
      outputPath,
      renderStaticPage(page, {
        cssLinks,
        scriptLinks: page.kind === 'tool' ? scriptLinks : [],
      }),
      'utf8',
    )
  }

  await writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml(), 'utf8')
  await writeFile(path.join(distDir, 'robots.txt'), buildRobotsTxt(), 'utf8')
}

function guide(config) {
  const pathName = `/guides/${config.slug}/`
  return {
    kind: 'guide',
    path: pathName,
    canonical: `${SITE_URL}${pathName}`,
    ...config,
    sections: [
      ...config.sections,
      ...getExtraGuideSections(config.slug),
      ...getStandardGuideSections(config),
    ],
  }
}

function tool(config) {
  const pathName = `/${config.slug}/`
  return {
    kind: 'tool',
    path: pathName,
    canonical: `${SITE_URL}${pathName}`,
    ...config,
  }
}

function getStandardGuideSections(config) {
  return [
    section('Final validation workflow', [
      `After you fix ${config.primaryKeyword}, validate the complete document instead of copying the edited fragment immediately. JSON errors are often chained: one syntax issue prevents the parser from reaching the next one. A document that fails once may reveal a different error after the first repair. Work in small steps until the entire payload is valid.`,
      'When the validator reports success, format the JSON and scan the indentation. Correct indentation makes object and array boundaries visible, which helps you catch structural surprises before using the payload in an API request, a configuration file, or a test fixture. If the formatted shape does not match what you expected, review the data before sending it downstream.',
      'Keep private payloads private during this process. JSONFmt runs in your browser and does not upload your input, but you should still avoid pasting secrets into screenshots, support tickets, or public issue reports. When you need help from another person, reduce the payload to a minimal example that reproduces the syntax problem without exposing production data.',
    ]),
  ]
}

function trust(config) {
  return {
    kind: 'trust',
    canonical: `${SITE_URL}${config.path}`,
    ...config,
  }
}

function section(heading, paragraphs) {
  return { heading, paragraphs }
}

function renderStaticHeader() {
  return `<header class="static-topbar">
  <a class="brand" href="/" aria-label="JSONFmt home"><span class="brand-mark">{ }</span><span>JSONFmt</span></a>
  <nav class="static-nav" aria-label="Primary navigation">
    <a href="/json-formatter/">Formatter</a>
    <a href="/json-validator/">Validator</a>
    <a href="/json-minifier/">Minifier</a>
    <a href="/json-error-finder/">Error Finder</a>
    <a href="/tools/">Tools</a>
    <a href="/guides/">Guides</a>
  </nav>
</header>`
}

function renderStaticFooter() {
  return `<footer class="static-footer">
  <span>JSON processed locally in your browser.</span>
  <nav aria-label="Footer navigation">
    <a href="/tools/">Tools</a>
    <a href="/json-formatter/">Formatter</a>
    <a href="/json-validator/">Validator</a>
    <a href="/json-minifier/">Minifier</a>
    <a href="/guides/">Guides</a>
    <a href="/privacy/">Privacy Policy</a>
    <a href="/terms/">Terms of Use</a>
    <a href="/contact/">Contact</a>
  </nav>
</footer>`
}

function renderStaticBody(page) {
  if (page.kind === 'tools-index') return renderToolsIndex()
  if (page.kind === 'tool') return renderToolPage(page)
  if (page.kind === 'guides-index') return renderGuidesIndex()
  if (page.kind === 'guide') return renderGuidePage(page)
  return renderTrustPage(page)
}

function renderToolsIndex() {
  return `<section class="static-hero">
  <p class="eyebrow">Browser-local JSON utilities</p>
  <h1>JSON tools for the task in front of you.</h1>
  <p class="static-lead">Format, validate, minify, view, and diagnose strict JSON without sending the content to a server.</p>
</section>
<section class="tool-card-grid" aria-label="JSON tool list">
  ${TOOL_PAGES.map((toolPage) => `<article class="tool-card">
    <p>${escapeHtml(toolPage.primaryKeyword)}</p>
    <h2><a href="${toolPage.path}">${escapeHtml(toolPage.heading)}</a></h2>
    <span>${escapeHtml(toolPage.summary)}</span>
    <a class="tool-card-link" href="${toolPage.path}">${escapeHtml(toolPage.action)}</a>
  </article>`).join('\n  ')}
</section>
<section class="entry-guides">
  <div>
    <p class="eyebrow">Need a correction?</p>
    <h2>Start with a practical JSON guide.</h2>
  </div>
  <div class="entry-link-list">
    ${GUIDE_PAGES.slice(0, 6).map((guidePage) => `<a href="${guidePage.path}">${escapeHtml(guidePage.title)}</a>`).join('\n    ')}
  </div>
</section>`
}

function renderGuidesIndex() {
  return `<section class="static-hero">
  <p class="eyebrow">JSON error guides</p>
  <h1>Fix common JSON syntax errors.</h1>
  <p class="static-lead">Practical explanations for the errors developers hit most often when validating strict JSON.</p>
</section>
<section class="guide-card-grid" aria-label="JSON error guide list">
  ${GUIDE_PAGES.map((guidePage) => `<article class="guide-card">
    <p>${escapeHtml(guidePage.primaryKeyword)}</p>
    <h2><a href="${guidePage.path}">${escapeHtml(guidePage.title)}</a></h2>
    <span>${escapeHtml(guidePage.summary)}</span>
  </article>`).join('\n  ')}
</section>`
}

function renderGuidePage(page) {
  return `<article class="article-shell">
  <p class="eyebrow">JSON syntax guide</p>
  <h1>${escapeHtml(page.title)}</h1>
  <p class="static-lead">${escapeHtml(page.summary)}</p>
  <div class="article-cta top"><a href="/json-error-finder/">Try it in JSON Error Finder</a></div>
  <nav class="article-toc" aria-label="Article sections">
    <strong>On this page</strong>
    ${page.sections.map((item) => `<a href="#${slugify(item.heading)}">${escapeHtml(item.heading)}</a>`).join('')}
    <a href="#faq">FAQ</a>
  </nav>
  <section class="code-comparison" aria-label="Invalid and fixed JSON examples">
    <div>
      <span>Invalid JSON</span>
      <pre><code>${escapeHtml(page.invalidCode)}</code></pre>
    </div>
    <div>
      <span>Fixed JSON</span>
      <pre><code>${escapeHtml(page.fixedCode)}</code></pre>
    </div>
  </section>
  ${page.sections.slice(0, 2).map(renderArticleSection).join('\n')}
  ${renderAdPlaceholder('Reserved article placement')}
  ${page.sections.slice(2).map(renderArticleSection).join('\n')}
  ${renderFaq(page.faq)}
  ${renderAdPlaceholder('Reserved end-of-article placement')}
  ${renderRelatedLinks(page)}
  <div class="article-cta"><a href="/json-error-finder/">Try it in JSON Error Finder</a></div>
</article>`
}

function renderToolPage(page) {
  return `<main class="static-shell">
  ${renderStaticHeader()}
  <section class="static-hero tool-hero">
    <p class="eyebrow">Privacy-first JSON tool</p>
    <h1>${escapeHtml(page.heading)}</h1>
    <p class="static-lead">${escapeHtml(page.summary)}</p>
  </section>
  <section class="tool-preview-grid" aria-label="${escapeHtml(page.heading)} workspace preview">
    <div class="tool-preview">
      <div class="tool-preview-bar"><span>JSON input</span><span>Runs locally</span></div>
      <pre><code>{
  "service": "JSONFmt",
  "private": true,
  "tasks": ["format", "validate", "minify"]
}</code></pre>
    </div>
    <aside class="tool-preview-result">
      <p class="eyebrow">${escapeHtml(page.action)}</p>
      <h2>Open the local workspace.</h2>
      <p>The interactive JSON editor loads on this page. Paste JSON, inspect the result, and keep the data in your browser.</p>
    </aside>
  </section>
  <article class="article-shell tool-copy">
    ${page.sections.map(renderArticleSection).join('\n')}
    ${renderFaq(page.faq)}
    ${renderRelatedLinks(page)}
  </article>
  ${renderStaticFooter()}
</main>`
}

function renderTrustPage(page) {
  return `<article class="article-shell trust-page">
  <p class="eyebrow">JSONFmt</p>
  <h1>${escapeHtml(page.heading)}</h1>
  <p class="static-lead">${escapeHtml(page.description)}</p>
  ${page.sections.map(([heading, paragraphs]) => `<section id="${slugify(heading)}">
    <h2>${escapeHtml(heading)}</h2>
    ${paragraphs.map((paragraph) => `<p>${linkifyEmail(escapeInlineCode(paragraph))}</p>`).join('\n    ')}
  </section>`).join('\n')}
</article>`
}

function renderArticleSection(item) {
  return `<section id="${slugify(item.heading)}">
  <h2>${escapeHtml(item.heading)}</h2>
  ${item.paragraphs.map((paragraph) => `<p>${escapeInlineCode(paragraph)}</p>`).join('\n  ')}
</section>`
}

function renderFaq(faq) {
  return `<section id="faq" class="article-faq">
  <h2>Frequently Asked Questions</h2>
  ${faq.map(([question, answer]) => `<h3>${escapeHtml(question)}</h3>
  <p>${escapeInlineCode(answer)}</p>`).join('\n  ')}
</section>`
}

function renderRelatedLinks(page) {
  const relatedTools = TOOL_PAGES.filter((toolPage) => toolPage.path !== page.path).slice(0, 4)
  const relatedGuides = GUIDE_PAGES.filter((guidePage) => guidePage.path !== page.path).slice(0, 4)

  return `<section class="related-links">
  <div>
    <p class="eyebrow">Related JSON tools</p>
    ${relatedTools.map((toolPage) => `<a href="${toolPage.path}">${escapeHtml(toolPage.heading)}</a>`).join('\n    ')}
  </div>
  <div>
    <p class="eyebrow">Related guides</p>
    ${relatedGuides.map((guidePage) => `<a href="${guidePage.path}">${escapeHtml(guidePage.title)}</a>`).join('\n    ')}
  </div>
</section>`
}

function renderAdPlaceholder(label) {
  return `<aside class="ad-placeholder" aria-label="${escapeHtml(label)}">
  <span>Ad placement reserved for future review</span>
</aside>`
}

function getStructuredData(page) {
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'JSONFmt',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.heading ?? page.title,
        item: page.canonical,
      },
    ],
  }

  if (page.kind === 'tool') {
    return [
      website,
      breadcrumb,
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: page.heading,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        url: page.canonical,
        description: page.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faq.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
          },
        })),
      },
    ]
  }

  if (page.kind !== 'guide') return [website, breadcrumb]

  return [
    website,
    breadcrumb,
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.title,
      description: page.description,
      mainEntityOfPage: page.canonical,
      datePublished: today,
      dateModified: today,
      author: {
        '@type': 'Organization',
        name: 'JSON Formatter team',
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })),
    },
  ]
}

async function getBuiltCssLinks(distDir) {
  try {
    const assetsDir = path.join(distDir, 'assets')
    const files = await readdir(assetsDir)
    return files
      .filter((file) => file.endsWith('.css'))
      .map((file) => `/assets/${file}`)
  } catch {
    const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8').catch(() => '')
    return [...indexHtml.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((match) => match[1])
  }
}

async function getBuiltScriptLinks(distDir) {
  const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8').catch(() => '')
  return [...indexHtml.matchAll(/<script[^>]+type="module"[^>]+src="([^"]+)"/g)].map((match) => match[1])
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function escapeInlineCode(value) {
  const escaped = escapeHtml(value)
  return escaped.replaceAll(/`([^`]+)`/g, '<code>$1</code>')
}

function linkifyEmail(value) {
  return value.replaceAll(CONTACT_EMAIL, `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`)
}

function slugify(value) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/^-|-$/g, '')
}

const runningDirectly = process.argv[1] && import.meta.url === pathToFileURL(fileURLToPath(import.meta.url)).href && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (runningDirectly) {
  await writeStaticPages()
}
