Project rules offer a powerful and flexible system with path specific configurations. Project rules are stored in the `.cursor/rules` directory and provide granular control over AI behavior in different parts of your project.

Here’s how they work

- **Semantic Descriptions**: Each rule can include a description of when it should be applied
- **File Pattern Matching**: Use glob patterns to specify which files/folders the rule applies to
- **Automatic Attachment**: Rules can be automatically included when matching files are referenced
- **Reference files**: Use @file in your project rules to include them as context when the rule is applied.

Example use cases:

- Framework-specific rules for certain file types (e.g., SolidJS preferences for `.tsx` files)
- Special handling for auto-generated files (e.g., `.proto` files)
- Custom UI development patterns
- Code style and architecture preferences for specific folders



## How to Create Effective Cursor Rules

### What Makes a Good Rule

- Easy to understand - avoid complex jargon
- Specific to your project or coding style
- Matches your team's agreed-upon practices
- Works for different parts of your code
- Simple to update as your project grows

### Tips for Writing Better Rules

- Begin with basic rules, then add more as needed
- Write as if you're explaining to a colleague
- Include examples from your own code
- Think about how the rule applies to your project
- Check and update your rules regularly

### Making Your Rules Work Better

- Use words and terms you use in your daily coding
- Briefly describe your project or feature
- Show short code examples when it helps
- Mention any specific requirements or limitations
- Ask for explanations when you need them



参考网站：[Cursor Rule Maker](https://cursorrules.agnt.one/chat)