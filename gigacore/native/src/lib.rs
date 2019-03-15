#[macro_use]
extern crate neon;

use neon::prelude::*;

fn hello_world(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello world!"))
}

register_module!(mut m, {
    m.export_function("hello", hello_world)
});