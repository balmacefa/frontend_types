

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

    meta_tags_default = () => /*template*/ `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    `;

    title_tag = (title: string) => /*template*/ `<title>${title}</title>`;

    html_document = (args: {
        head_tags: string,
        body: {
            class: string,
            attributes: string
        },
        content: string,
        script_tags: string
    }) =>/*template*/ `
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



export class Bootstrap5 extends BaseRender {

    meta_tags_default = () => /*template*/ `
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
            script_tags: /*template*/`${CDN.bootstrap_5_js}`
        });
    }
}


export class Purecss extends BaseRender {

    meta_tags_default = () => /*template*/ `
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
        class?: string
    }): string;
    Row(args: {
        class?: string
    }): string;
    Column(args: {
        size?: ColumnSize,
        class?: string
    }): string;
    Grid(args: {
        columns: GridColumn[],
        class?: string
    }): string;
}

export class Bootstrap5Layout implements ILayout {
    Container(args: { size?: ContainerSize, fluid?: boolean, class?: string } = {}): string {

        const { size = 'xl', fluid = false } = args;

        let classList = `container${fluid ? '-fluid' : size ? `-${size}` : ''}`;
        return /*template*/`<div class="${classList} ${args.class || ''}"></div>`;
    }

    Row(args: {
        class?: string
    }): string {
        return /*template*/ `<div class="row ${args.class || ''}"></div>`;
    }

    Column(args: {
        size?: ColumnSize,
        class?: string
    }): string {
        const { size = '' } = args || {};
        let classList = size === 'auto' ? 'col' : `col-${size}`;
        return /*template*/ `<div class="${classList}  ${args.class || ''}"></div>`;
    }

    Grid(args: {
        columns: GridColumn[],
        class?: string
    }): string {
        const { columns } = args || {};
        let rowContent = columns.map(col => this.Column({ size: col.size, class: col.content })).join('');
        return this.Row({
            class: args.class || ''
        });
    }
}


export class PurecssLayout implements ILayout {
    Container(args: { size?: ContainerSize, fluid?: boolean, class?: string }): string {
        // Using 'pure-g' for the grid system as Pure.CSS does not have a dedicated container class
        const containerClass = args.fluid ? 'pure-g' : 'custom-container';
        const additionalClass = args.class || '';
        return /*template*/`<div class="${containerClass} ${additionalClass}"></div>`;
    }

    Row(args: { class?: string }): string {
        // In Pure.CSS, a row is essentially a 'pure-g' class
        const rowClass = 'pure-g';
        const additionalClass = args.class || '';
        return /*template*/`<div class="${rowClass} ${additionalClass}"></div>`;
    }

    Column(args: { size?: ColumnSize, class?: string }): string {
        // Pure.CSS uses fractions (e.g., pure-u-1-3 for a column taking up 1/3 of the container)
        // This implementation assumes a simple mapping from ColumnSize to Pure.CSS's fraction classes
        const baseClass = 'pure-u';
        const sizeClass = args.size ? this.mapSizeToPureClass(args.size) : '1'; // Default to full width if size is not provided
        const additionalClass = args.class || '';
        return /*template*/`<div class="${baseClass}${sizeClass} ${additionalClass}"></div>`;
    }

    Grid(args: { columns: GridColumn[], class?: string }): string {
        // Implementing the Grid method by constructing a row and filling it with columns
        const rowClass = args.class || '';
        const columnsHtml = args.columns.map(col => this.Column({
            size: col.size,
            class: col.content // Assuming the 'content' is additional class names; adjust if content is supposed to be inner HTML
        })).join('');
        return /*template*/`<div class="pure-g ${rowClass}">${columnsHtml}</div>`;
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

