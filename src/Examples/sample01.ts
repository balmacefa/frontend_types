import express from 'express';
import { Bootstrap5Framework } from "../Layers/Foundation/BaseFoundation";

// Simulated data structure for webhooks
type Webhook = {
    name: string;
    url: string;
    enabled: boolean;
};



// Framework is assumed to be previously defined and implemented with Bootstrap5 styles
const framework = new Bootstrap5Framework();

// Function to create the side navigation
function createSideNavigation(): string {
    // Here we would create the side navigation menu using the framework's layout and utility components.

    const sideNav = framework.applicationLayer.Navbar({
        items: [
            {
                text: 'Overview', active: true, href: '#',
                id: ''
            },
            { text: 'API Tokens', active: false, href: '#', id: '' },
            // Add more nav items as needed
            { text: 'Webhooks', active: false, href: '#', id: '' }
        ],
        type: 'vertical'
    })

    return framework.layout.Container({
        class: 'side-nav',
        content: sideNav
    });
}

// Function to create the main content area for webhooks management
function createWebhooksManagement(webhooks: Webhook[]): string {
    const webhookRows = webhooks.map(webhook => {
        return framework.layout.Row({
            class: webhook.enabled ? 'webhook-row enabled' : 'webhook-row disabled',
            content: `
                ${framework.layout.Column({ size: 'auto', class: 'webhook-name', content: webhook.name })}
                ${framework.layout.Column({ size: 'auto', class: 'webhook-url', content: webhook.url })}
                ${framework.layout.Column({
                size: 'auto',
                class: 'webhook-status',
                content: webhook.enabled ? 'Enabled' : 'Disabled'
            })}
                ${framework.applicationLayer.Button({
                type: 'button',
                text: webhook.enabled ? 'Disable' : 'Enable',
                onClick: `toggleWebhook('${webhook.name}')`, // Assume a corresponding JS function to handle the toggle
                class: 'toggle-button'
            })}
            `
        });
    }).join('');

    return framework.layout.Container({
        class: 'webhooks-management',
        content: `
            <h1>Webhooks</h1>
            <p>Get POST changes notifications</p>
            ${webhookRows}
            ${framework.applicationLayer.Button({
            type: 'button',
            text: 'Create new webhook',
            onClick: 'openCreateNewWebhookModal()', // Assume a corresponding JS function to open a modal for creation
            class: 'create-button'
        })}
        `
    });
}

// Full HTML render function
function renderFullHTML(webhooks: Webhook[]): string {
    const sideNav = createSideNavigation();
    const mainContent = createWebhooksManagement(webhooks);

    const dashboard = `
            <div class="dashboard">
                ${sideNav}
                ${mainContent}
            </div>
    `;
    return framework.baseRender.html_document({
        head_tags: framework.baseRender.meta_tags_default() + framework.baseRender.title_tag('Webhooks Management'),
        body: {
            class: '',
            attributes: '',
        },
        content: dashboard,
        script_tags: ''
    });

}

// Mock webhooks data for demonstration
const webhooksData: Webhook[] = [
    { name: 'Gatsby', url: 'https://www.gatsbyjs.com/features/jamstack/87g5gfDq54juhn98/', enabled: true },
    { name: 'Netlify', url: 'https://www.gatsbyjs.com/features/jamstack/87g5gfDq54juhn98/', enabled: false },
    { name: 'Blog', url: 'https://www.gatsbyjs.com/features/jamstack/87g5gfDq54juhn98/', enabled: false }
];

// Generate the full HTML for the page
const fullHTML = renderFullHTML(webhooksData);
console.log(fullHTML); // This would typically be set in the innerHTML of an element or served as a full HTML response.


const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send(fullHTML);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});