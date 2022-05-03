import React, {useEffect, useState} from "react";
import {dstRunApi, neutronServerApi} from "../../common/requests";

export default function DSTTemplate() {
    const [defaultTemplates, setDefaultTemplates] = useState([]);
    const [customTemplates, setCustomTemplates] = useState([]);

    useEffect(() => {
        listTemplates();
    }, []);

    function TemplateList(props) {
        const templates = props.templates;
        const listItems = templates.map((template) => (
            <li key={template}>{template}</li>
        ));
        return (
            <ul>{listItems}</ul>
        );
    }

    function listTemplates() {
        dstRunApi({
            url: '/api/template',
            method: 'get',
        }).then((resp) => {
            setDefaultTemplates(resp.data['cluster']['default_templates']);
            setCustomTemplates(resp.data['cluster']['custom_templates']);
        });
    }

    function addTemplate(e) {
        e.preventDefault();
        let formData = new FormData(e.currentTarget);
        let name = formData.get('name');
        dstRunApi({
            url: '/api/template/' + name,
            method: 'post',
        });
    }

    function deleteTemplate(e) {
        e.preventDefault();
        let formData = new FormData(e.currentTarget);
        let name = formData.get('name');
        dstRunApi({
            url: '/api/template/' + name,
            method: 'delete',
        });
    }

    return (
        <div>
            <div>
                <h1>Template Cluster</h1>
                <div>
                    <h2>Template List</h2>
                    <button onClick={listTemplates}>Get</button>
                    <div>
                        <h3>Default Template</h3>
                        <TemplateList templates={defaultTemplates} />
                    </div>
                    <div>
                        <h3>Custom Template</h3>
                        <TemplateList templates={customTemplates}/>
                    </div>
                </div>
                <div>
                    <h2>Template Add</h2>
                    <form onSubmit={addTemplate}>
                        <label>
                            TemplateName
                            <input type="text" name="name" />
                        </label>
                        <input type="submit" value="Add" />
                    </form>
                </div>
                <div>
                    <h2>Template Delete</h2>
                    <form onSubmit={deleteTemplate}>
                        <label>
                            TemplateName
                            <input type="text" name="name" />
                        </label>
                        <input type="submit" value="Delete" />
                    </form>
                </div>
            </div>
        </div>
    );
}