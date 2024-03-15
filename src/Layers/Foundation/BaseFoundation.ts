import { CDN } from "./CDN";


export interface BaseRenderInterface {
    meta_tags_default: () => string;
    title_tag: (title: string) => string;
    html_document: (args: {
        head_tags: string,
        body: {
            class: string,
            attributes: string
        },
        content: string,
        script_tags: string
    }) => string;


}



export class BaseRender implements BaseRenderInterface {
    private static instance: BaseRender;

    public static I(): BaseRender {
        if (!BaseRender.instance) {
            BaseRender.instance = new BaseRender();
        }
        return BaseRender.instance;
    }

    meta_tags_default = () => /*html*/ `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    `;

    title_tag = (title: string) => /*html*/ `<title>${title}</title>`;

    html_document = (args: {
        head_tags: string,
        body: {
            class: string,
            attributes: string
        },
        content: string,
        script_tags: string
    }) =>/*html*/ `
<!DOCTYPE html>
<html lang="en">

<head>
  ${args.head_tags}
</head>

<body class="${args.body.class}" ${args.body.attributes} >
    ${args.content}
    ${args.script_tags}
</body>

</html>
`;

    // set up the default html document
    render_html = (args: {
        content: string
    }) => {
        return this.html_document({
            head_tags: this.meta_tags_default() + this.title_tag(''),
            body: {
                class: '',
                attributes: '',
            },
            content: args.content,
            script_tags: ''
        });
    }

}



export class BootstrapBaseRender extends BaseRender {

    meta_tags_default = () => /*html*/ `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${CDN.bootstrap_5_css}
    `;

    title = this.title_tag('Bootstrap 5');

    render_html = (args: {
        content: string
    }) => {
        return this.html_document({
            head_tags: this.meta_tags_default() + this.title,
            body: {
                class: '',
                attributes: '',
            },
            content: args.content,
            script_tags: /*html*/`${CDN.bootstrap_5_js}`
        });
    }
}


export class PurecssBaseRender extends BaseRender {

    meta_tags_default = () => /*html*/ `
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        ${CDN.purecss}
        `;

    title = this.title_tag('Purecss');

    render_html = (args: {
        content: string
    }) => {
        return this.html_document({
            head_tags: this.meta_tags_default() + this.title,
            body: {
                class: '',
                attributes: '',
            },
            content: args.content,
            script_tags: ''
        });
    }

}



// interface LayoutInterface {

// TODO add common arguments to functions
//     Container: () => string; // add arguments for class, id, attributes, and size
//     Row: () => string;
//     Col: () => string;
//     Grid: () => string;
//     MansoryGrid: () => string;
// }


type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// Simplified to match a 24-column grid system, excluding direct 5ths for simplicity
type ColumnSize = '' | 'auto' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24';

interface GridColumn {
    size: ColumnSize;
    content: string;
}

interface ILayout {
    Container(args: {
        size?: ContainerSize,
        fluid?: boolean,
        class?: string,
        content: string
    }): string;
    Row(args: {
        class?: string
        content: string
    }): string;
    Column(args: {
        size?: ColumnSize,
        class?: string
        content: string
    }): string;
    Grid(args: {
        columns: GridColumn[],
        class?: string
        content: string
    }): string;
}

export class Bootstrap5Layout implements ILayout {
    Container(args: { size?: ContainerSize, fluid?: boolean, class?: string, content: string }): string {

        const { size = 'xl', fluid = false, content } = args;

        let classList = `container${fluid ? '-fluid' : size ? `-${size}` : ''}`;
        return /*html*/`<div class="${classList} ${args.class || ''}">${content}</div>`;
    }

    Row(args: {
        class?: string,
        content: string
    }): string {
        return /*html*/ `<div class="row ${args.class || ''}">${args.content}</div>`;
    }

    Column(args: {
        size?: ColumnSize,
        class?: string,
        content: string
    }): string {
        const { size = '' } = args || {};
        let classList = size === 'auto' ? 'col' : `col-${size}`;
        return /*html*/ `<div class="${classList}  ${args.class || ''}">${args.content}</div>`;
    }

    Grid(args: {
        columns: GridColumn[],
        class?: string,
        content: string
    }): string {
        const { columns } = args || {};
        let rowContent = columns.map(col => this.Column({ size: col.size, class: col.content, content: col.content })).join('');
        return this.Row({
            class: args.class || '',
            content: rowContent
        });
    }
}


export class PurecssLayout implements ILayout {
    Container(args: { size?: ContainerSize, fluid?: boolean, class?: string, content: string }): string {
        // Using 'pure-g' for the grid system as Pure.CSS does not have a dedicated container class
        const containerClass = args.fluid ? 'pure-g' : 'custom-container';
        const additionalClass = args.class || '';
        return /*html*/`<div class="${containerClass} ${additionalClass}">${args.content}</div>`;
    }

    Row(args: { class?: string, content: string }): string {
        // In Pure.CSS, a row is essentially a 'pure-g' class
        const rowClass = 'pure-g';
        const additionalClass = args.class || '';
        return /*html*/`<div class="${rowClass} ${additionalClass}">${args.content}</div>`;
    }

    Column(args: { size?: ColumnSize, class?: string, content: string }): string {
        // Pure.CSS uses fractions (e.g., pure-u-1-3 for a column taking up 1/3 of the container)
        // This implementation assumes a simple mapping from ColumnSize to Pure.CSS's fraction classes
        const baseClass = 'pure-u';
        const sizeClass = args.size ? this.mapSizeToPureClass(args.size) : '1'; // Default to full width if size is not provided
        const additionalClass = args.class || '';
        return /*html*/`<div class="${baseClass}${sizeClass} ${additionalClass}">${args.content}</div>`;
    }

    Grid(args: { columns: GridColumn[], class?: string, content: string }): string {
        // Implementing the Grid method by constructing a row and filling it with columns
        const rowClass = args.class || '';
        const columnsHtml = args.columns.map(col => this.Column({
            size: col.size,
            class: col.content, // Assuming the 'content' is additional class names; adjust if content is supposed to be inner HTML
            content: col.content
        })).join('');
        return /*html*/`<div class="pure-g ${rowClass}">${args.content}${columnsHtml}</div>`;
    }

    private mapSizeToPureClass(size: ColumnSize): string {
        // This function maps the abstract ColumnSize to Pure.CSS's grid system classes
        // Pure.CSS uses a fraction-based system, so we map accordingly
        // Example: '1' (for full width) maps to 'pure-u-1-1', '6' (for half width) maps to 'pure-u-1-2', etc.
        // This implementation needs to be adjusted based on the actual sizes you intend to support
        const fraction = this.sizeToFraction(size);
        return fraction ? `-1-${fraction}` : '';
    }

    private sizeToFraction(size: ColumnSize): string {
        // Simplified mapping, consider extending this based on your application's needs
        const mapping: { [key: string]: string } = {
            '1': '24', '2': '12', '3': '8', '4': '6', '6': '4', '8': '3', '12': '2', '24': '1'
        };
        return mapping[size] || '1'; // Default to full width
    }
}




interface IForm {
    Fieldset(args: { legend: string, content: string, class?: string }): string;
    Field(args: { type: string, name: string, placeholder?: string, value?: string, class?: string }): string;
    Label(args: { forInput: string, text: string, class?: string }): string;
    Textarea(args: { name: string, placeholder?: string, rows?: number, class?: string }): string;
    Checkbox(args: { name: string, checked?: boolean, class?: string }): string;
    Select(args: { name: string, options: { value: string, text: string }[], selectedValue?: string, class?: string }): string;
}


export class BootstrapForm implements IForm {
    Fieldset(args: { legend: string, content: string, class?: string }): string {
        const { legend, content, class: className = '' } = args;
        return /*html*/`<fieldset class="form-group ${className}"><legend>${legend}</legend>${content}</fieldset>`;
    }

    Field(args: { type: string, name: string, placeholder?: string, value?: string, class?: string }): string {
        const { type, name, placeholder = '', value = '', class: className = '' } = args;
        return /*html*/`<input type="${type}" name="${name}" placeholder="${placeholder}" value="${value}" class="form-control ${className}" />`;
    }

    Label(args: { forInput: string, text: string, class?: string }): string {
        const { forInput, text, class: className = '' } = args;
        return /*html*/`<label for="${forInput}" class="${className}">${text}</label>`;
    }

    Textarea(args: { name: string, placeholder?: string, rows?: number, class?: string }): string {
        const { name, placeholder = '', rows = 3, class: className = '' } = args;
        return /*html*/`<textarea name="${name}" placeholder="${placeholder}" rows="${rows}" class="form-control ${className}"></textarea>`;
    }

    Checkbox(args: { name: string, checked?: boolean, class?: string }): string {
        const { name, checked = false, class: className = '' } = args;
        const checkedAttribute = checked ? ' checked' : '';
        return /*html*/`<div class="form-check"><input type="checkbox" name="${name}" class="form-check-input ${className}"${checkedAttribute}><label class="form-check-label" for="${name}"></label></div>`;
    }

    Select(args: { name: string, options: { value: string, text: string }[], selectedValue?: string, class?: string }): string {
        const { name, options, selectedValue = '', class: className = '' } = args;
        const optionsHtml = options.map(option => {
            const selectedAttribute = option.value === selectedValue ? ' selected' : '';
            return /*html*/`<option value="${option.value}"${selectedAttribute}>${option.text}</option>`;
        }).join('');
        return /*html*/`<select name="${name}" class="form-select ${className}">${optionsHtml}</select>`;
    }
}



export class PurecssForm implements IForm {
    Fieldset(args: { legend: string, content: string, class?: string }): string {
        const { legend, content, class: className = '' } = args;
        return /*html*/`<fieldset class="${className}"><legend>${legend}</legend>${content}</fieldset>`;
    }

    Field(args: { type: string, name: string, placeholder?: string, value?: string, class?: string }): string {
        const { type, name, placeholder = '', value = '', class: className = '' } = args;
        return /*html*/`<input type="${type}" name="${name}" placeholder="${placeholder}" value="${value}" class="${className}" />`;
    }

    Label(args: { forInput: string, text: string, class?: string }): string {
        const { forInput, text, class: className = '' } = args;
        return /*html*/`<label for="${forInput}" class="${className}">${text}</label>`;
    }

    Textarea(args: { name: string, placeholder?: string, rows?: number, class?: string }): string {
        const { name, placeholder = '', rows = 3, class: className = '' } = args;
        return /*html*/`<textarea name="${name}" placeholder="${placeholder}" rows="${rows}" class="${className}"></textarea>`;
    }

    Checkbox(args: { name: string, checked?: boolean, class?: string }): string {
        const { name, checked = false, class: className = '' } = args;
        const checkedAttribute = checked ? ' checked' : '';
        return /*html*/`<label class="pure-checkbox ${className}"><input type="checkbox" name="${name}"${checkedAttribute}> </label>`;
    }

    Select(args: { name: string, options: { value: string, text: string }[], selectedValue?: string, class?: string }): string {
        const { name, options, selectedValue = '', class: className = '' } = args;
        const optionsHtml = options.map(option => {
            const selectedAttribute = option.value === selectedValue ? ' selected' : '';
            return /*html*/`<option value="${option.value}"${selectedAttribute}>${option.text}</option>`;
        }).join('');
        return /*html*/`<select name="${name}" class="${className}">${optionsHtml}</select>`;
    }
}


interface IUtilities {
    Iframe(args: {
        src: string,
        width?: string,
        height?: string,
        class?: string,
        frameborder?: string,
        allow?: string,
        allowfullscreen?: boolean
    }): string;

    // Example method for an image utility
    Image(args: {
        src: string,
        alt?: string,
        width?: string,
        height?: string,
        class?: string
    }): string;

    // Add other utility methods here...
}


export class BootstrapUtilities implements IUtilities {

    Iframe(args: {
        src: string,
        width?: string,
        height?: string,
        class?: string,
        frameborder?: string,
        allow?: string,
        allowfullscreen?: boolean
    }): string {
        const { src, width = '100%', height = '100%', class: className = '', frameborder = '0', allow = '', allowfullscreen = true } = args;
        const allowAttribute = allow ? ` allow="${allow}"` : '';
        const allowFullscreenAttribute = allowfullscreen ? ' allowfullscreen' : '';
        return /*html*/`<iframe src="${src}" width="${width}" height="${height}" class="${className}" frameborder="${frameborder}"${allowAttribute}${allowFullscreenAttribute}></iframe>`;
    }

    Image(args: {
        src: string,
        alt?: string,
        width?: string,
        height?: string,
        class?: string
    }): string {
        const { src, alt = '', width = '', height = '', class: className = '' } = args;
        return /*html*/`<img src="${src}" alt="${alt}" width="${width}" height="${height}" class="${className}" />`;
    }
}


export class PurecssUtilities implements IUtilities {
    Iframe(args: {
        src: string,
        width?: string,
        height?: string,
        class?: string,
        frameborder?: string,
        allow?: string,
        allowfullscreen?: boolean
    }): string {
        const { src, width = '100%', height = '100%', class: className = '', frameborder = '0', allow = '', allowfullscreen = true } = args;
        const allowAttribute = allow ? ` allow="${allow}"` : '';
        const allowFullscreenAttribute = allowfullscreen ? ' allowfullscreen' : '';
        return /*html*/`<iframe src="${src}" width="${width}" height="${height}" class="${className}" frameborder="${frameborder}"${allowAttribute}${allowFullscreenAttribute}></iframe>`;
    }

    Image(args: {
        src: string,
        alt?: string,
        width?: string,
        height?: string,
        class?: string
    }): string {
        const { src, alt = '', width = '', height = '', class: className = '' } = args;
        return /*html*/`<img src="${src}" alt="${alt}" width="${width}" height="${height}" class="${className}" />`;
    }
}

interface IApplicationLayer {
    Tabs(args: {
        id: string,
        tabs: { id: string, title: string, content: string, active?: boolean }[],
        class?: string
    }): string;

    Button(args: {
        type: string,
        text: string,
        onClick: string,
        class?: string
    }): string;

    Card(args: {
        title: string,
        content: string,
        imageUrl?: string,
        footerContent?: string,
        class?: string
    }): string;

    Pagination(args: {
        currentPage: number,
        totalPages: number,
        class?: string
    }): string;

    Navbar(args: {
        type: 'vertical' | 'horizontal',
        items: { id: string, text: string, href: string, active?: boolean }[],
        class?: string
    }): string;

    ProgressBar(args: {
        value: number, // Current value (e.g., 70 for 70%)
        max: number, // Max value (typically 100 for percentages)
        class?: string
    }): string;

    Loader(args: {
        type: 'spinner' | 'bar',
        class?: string
    }): string;

    Alert(args: {
        content: string,
        type: 'success' | 'info' | 'warning' | 'danger',
        class?: string
    }): string;

    Popup(args: {
        content: string,
        title?: string,
        class?: string
    }): string;

    Collapse(args: {
        id: string,
        content: string,
        collapsedByDefault?: boolean,
        class?: string
    }): string;
}

export class Bootstrap5ApplicationLayer implements IApplicationLayer {
    Tabs(args: { id: string; tabs: { id: string; title: string; content: string; active?: boolean | undefined; }[]; class?: string | undefined; }): string {
        const { id, tabs, class: className } = args;
        const tabItems = tabs.map(tab => {
            const activeClass = tab.active ? 'active' : '';
            return /*html*/ `<li class="nav-item">
                        <a class="nav-link ${activeClass}" id="${tab.id}-tab" data-bs-toggle="pill" href="#${tab.id}" role="tab" aria-controls="${tab.id}" aria-selected="${tab.active}">
                            ${tab.title}
                        </a>
                    </li>`;
        }).join('');

        const tabContents = tabs.map(tab => {
            const activeClass = tab.active ? 'show active' : '';
            return /*html*/ `<div class="tab-pane fade ${activeClass}" id="${tab.id}" role="tabpanel" aria-labelledby="${tab.id}-tab">
                        ${tab.content}
                    </div>`;
        }).join('');

        return /*html*/ `<div class="tabs ${className}">
                    <ul class="nav nav-pills" id="${id}" role="tablist">
                        ${tabItems}
                    </ul>
                    <div class="tab-content">
                        ${tabContents}
                    </div>
                </div>`;
    }

    Button(args: { type: string; text: string; onClick: string; class?: string | undefined; }): string {
        const { type, text, onClick, class: className } = args;
        return /*html*/ `<button type="${type}" class="btn ${className}" onclick="${onClick}">${text}</button>`;
    }

    Card(args: { title: string; content: string; imageUrl?: string | undefined; footerContent?: string | undefined; class?: string | undefined; }): string {
        const { title, content, imageUrl, footerContent, class: className } = args;
        const imageTag = imageUrl ? /*html*/ `<img src="${imageUrl}" class="card-img-top" alt="${title}">` : '';
        const footerTag = footerContent ? /*html*/ `<div class="card-footer">${footerContent}</div>` : '';
        return /*html*/ `<div class="card ${className}">
                    ${imageTag}
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${content}</p>
                    </div>
                    ${footerTag}
                </div>`;
    }

    Pagination(args: { currentPage: number; totalPages: number; class?: string | undefined; }): string {
        const { currentPage, totalPages, class: className } = args;
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        const pageItems = pages.map(page => {
            const activeClass = page === currentPage ? 'active' : '';
            return /*html*/ `<li class="page-item ${activeClass}">
                        <a class="page-link" href="#">${page}</a>
                    </li>`;
        }).join('');

        return /*html*/ `<nav class="pagination ${className}">
                    <ul class="pagination">
                        ${pageItems}
                    </ul>
                </nav>`;
    }

    Navbar(args: { type: "vertical" | "horizontal"; items: { id: string; text: string; href: string; active?: boolean | undefined; }[]; class?: string | undefined; }): string {
        const { type, items, class: className } = args;
        const navItems = items.map(item => {
            const activeClass = item.active ? 'active' : '';
            return /*html*/ `<li class="nav-item">
                        <a class="nav-link ${activeClass}" href="${item.href}">${item.text}</a>
                    </li>`;
        }).join('');

        const navClass = type === 'vertical' ? 'navbar-nav flex-column' : 'navbar-nav';

        return /*html*/ `<nav class="navbar ${className}">
                    <ul class="${navClass}">
                        ${navItems}
                    </ul>
                </nav>`;
    }

    ProgressBar(args: {
        value: number; // Current value (e.g., 70 for 70%)
        // Current value (e.g., 70 for 70%)
        max: number; // Max value (typically 100 for percentages)
        // Max value (typically 100 for percentages)
        class?: string | undefined;
    }): string {
        const { value, max, class: className } = args;
        const percentage = (value / max) * 100;
        return /*html*/ `<div class="progress ${className}">
                    <div class="progress-bar" role="progressbar" style="width: ${percentage}%" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${max}"></div>
                </div>`;
    }

    Loader(args: { type: "spinner" | "bar"; class?: string | undefined; }): string {
        const { type, class: className } = args;
        const spinnerClass = type === 'spinner' ? 'spinner-border' : 'progress-bar';
        return /*html*/ `<div class="${spinnerClass} ${className}" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>`;
    }

    Alert(args: { content: string; type: "success" | "info" | "warning" | "danger"; class?: string | undefined; }): string {
        const { content, type, class: className } = args;
        return /*html*/ `<div class="alert alert-${type} ${className}" role="alert">
                    ${content}
                </div>`;
    }

    Popup(args: { content: string; title?: string | undefined; class?: string | undefined; }): string {
        const { content, title, class: className } = args;
        const titleTag = title ? /*html*/ `<div class="popup-title">${title}</div>` : '';
        return /*html*/ `<div class="popup ${className}">
                    ${titleTag}
                    <div class="popup-content">
                        ${content}
                    </div>
                </div>`;
    }

    Collapse(args: { id: string; content: string; collapsedByDefault?: boolean | undefined; class?: string | undefined; }): string {
        const { id, content, collapsedByDefault, class: className } = args;
        const collapsedClass = collapsedByDefault ? 'collapsed' : '';
        return /*html*/ `<div class="collapse ${collapsedClass} ${className}" id="${id}">
                    ${content}
                </div>`;
    }
}

export class PurecssApplicationLayer implements IApplicationLayer {
    Tabs(args: { id: string; tabs: { id: string; title: string; content: string; active?: boolean | undefined; }[]; class?: string | undefined; }): string {
        // Implement the Tabs method here
        const { id, tabs, class: className } = args;
        const tabItems = tabs.map(tab => {
            const activeClass = tab.active ? 'active' : '';
            return /*html*/ `<div id="${tab.id}" class="tab-item ${activeClass}">${tab.title}</div>`;
        }).join('');
        const tabContent = tabs.map(tab => {
            const activeClass = tab.active ? 'active' : '';
            return /*html*/ `<div id="${tab.id}-content" class="tab-content ${activeClass}">${tab.content}</div>`;
        }).join('');
        return /*html*/ `<div id="${id}" class="tabs ${className}">
            <div class="tab-items">${tabItems}</div>
            <div class="tab-contents">${tabContent}</div>
        </div>`;
    }

    Button(args: { type: string; text: string; onClick: string; class?: string | undefined; }): string {
        // Implement the Button method here
        const { type, text, onClick, class: className } = args;
        return /*html*/ `<button type="${type}" class="${className}" onclick="${onClick}">${text}</button>`;
    }

    Card(args: { title: string; content: string; imageUrl?: string | undefined; footerContent?: string | undefined; class?: string | undefined; }): string {
        // Implement the Card method here
        const { title, content, imageUrl, footerContent, class: className } = args;
        const imageTag = imageUrl ? /*html*/ `<img src="${imageUrl}" alt="${title}" class="card-image">` : '';
        const footerTag = footerContent ? /*html*/ `<div class="card-footer">${footerContent}</div>` : '';
        return /*html*/ `<div class="card ${className}">
            ${imageTag}
            <div class="card-body">
                <h2 class="card-title">${title}</h2>
                <div class="card-content">${content}</div>
            </div>
            ${footerTag}
        </div>`;
    }

    Pagination(args: { currentPage: number; totalPages: number; class?: string | undefined; }): string {
        // Implement the Pagination method here
        const { currentPage, totalPages, class: className } = args;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            pages.push(`<div class="page ${activeClass}">${i}</div>`);
        }
        return /*html*/ `<div class="pagination ${className}">
            ${pages.join('')}
        </div>`;
    }

    Navbar(args: { type: "vertical" | "horizontal"; items: { id: string; text: string; href: string; active?: boolean | undefined; }[]; class?: string | undefined; }): string {
        // Implement the Navbar method here
        const { type, items, class: className } = args;
        const navItems = items.map(item => {
            const activeClass = item.active ? 'active' : '';
            return /*html*/ `<a id="${item.id}" href="${item.href}" class="nav-item ${activeClass}">${item.text}</a>`;
        }).join('');
        const navClass = type === 'vertical' ? 'vertical-nav' : 'horizontal-nav';
        return /*html*/ `<nav class="${navClass} ${className}">
            ${navItems}
        </nav>`;
    }

    ProgressBar(args: {
        value: number; // Current value (e.g., 70 for 70%)
        max: number; // Max value (typically 100 for percentages)
        class?: string | undefined;
    }): string {
        // Implement the ProgressBar method here
        const { value, max, class: className } = args;
        const percentage = (value / max) * 100;
        return /*html*/ `<div class="progress-bar ${className}">
            <div class="progress" style="width: ${percentage}%"></div>
        </div>`;
    }

    Loader(args: { type: "spinner" | "bar"; class?: string | undefined; }): string {
        // Implement the Loader method here
        const { type, class: className } = args;
        const loaderClass = type === 'spinner' ? 'spinner-loader' : 'bar-loader';
        return /*html*/ `<div class="loader ${loaderClass} ${className}"></div>`;
    }

    Alert(args: { content: string; type: "success" | "info" | "warning" | "danger"; class?: string | undefined; }): string {
        // Implement the Alert method here
        const { content, type, class: className } = args;
        return /*html*/ `<div class="alert ${type} ${className}">
            ${content}
        </div>`;
    }

    Popup(args: { content: string; title?: string | undefined; class?: string | undefined; }): string {
        // Implement the Popup method here
        const { content, title, class: className } = args;
        const titleTag = title ? /*html*/ `<h2 class="popup-title">${title}</h2>` : '';
        return /*html*/ `<div class="popup ${className}">
            ${titleTag}
            <div class="popup-content">${content}</div>
        </div>`;
    }

    Collapse(args: { id: string; content: string; collapsedByDefault?: boolean | undefined; class?: string | undefined; }): string {
        // Implement the Collapse method here
        const { id, content, collapsedByDefault, class: className } = args;
        const collapsedClass = collapsedByDefault ? 'collapsed' : '';
        return /*html*/ `<div id="${id}" class="collapse ${collapsedClass} ${className}">
            <div class="collapse-content">${content}</div>
        </div>`;
    }
}



// Define the interfaces for the framework classes to ensure they have the required properties
export interface IFramework {
    layout: ILayout;
    form: IForm;
    utilities: IUtilities;
    applicationLayer: IApplicationLayer;
}

// Bootstrap5Framework class that composes the Bootstrap specific implementations
export class Bootstrap5Framework implements IFramework {
    public layout: ILayout;
    public form: IForm;
    public utilities: IUtilities;
    public applicationLayer: IApplicationLayer;
    public baseRender: BaseRenderInterface; // Add the property

    constructor() {
        this.layout = new Bootstrap5Layout();
        this.form = new BootstrapForm();
        this.utilities = new BootstrapUtilities();
        this.applicationLayer = new Bootstrap5ApplicationLayer();
        this.baseRender = new BootstrapBaseRender(); // Initialize the property
    }
}

// PureCSSFramework class that composes the PureCSS specific implementations
export class PureCSSFramework implements IFramework {
    public layout: ILayout;
    public form: IForm;
    public utilities: IUtilities;
    public applicationLayer: IApplicationLayer;
    public baseRender: BaseRenderInterface; // Add the property

    constructor() {
        this.layout = new PurecssLayout();
        this.form = new PurecssForm();
        this.utilities = new PurecssUtilities();
        this.applicationLayer = new PurecssApplicationLayer();
        this.baseRender = new PurecssBaseRender(); // Initialize the property
    }
}


